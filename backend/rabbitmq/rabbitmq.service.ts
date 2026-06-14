import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMqService implements OnModuleInit, OnModuleDestroy {
  private connection: any;
  private channel: any;
  private exchangeName: string;

  constructor(private readonly config: ConfigService) {
    this.exchangeName = this.config.get<string>(
      'RABBITMQ_EXCHANGE',
      'smartair.measurements',
    );
  }

  async onModuleInit() {
    const rabbitUrl = this.config.get<string>(
      'RABBITMQ_URL',
      'amqp://localhost:5672',
    );

    // Opretter forbindelse til RabbitMQ.
    this.connection = await amqp.connect(rabbitUrl);

    // Channel bruges til at sende beskeder.
    this.channel = await this.connection.createChannel();

    // Fanout exchange betyder pub-sub:
    // én besked kan sendes videre til flere subscribers.
    await this.channel.assertExchange(this.exchangeName, 'fanout', {
      durable: true,
    });

    console.log('RabbitMQ connected');
  }

  async publishMeasurementCreated(measurement: any) {
    if (!this.channel) {
      console.warn('RabbitMQ channel not ready');
      return;
    }

    const event = {
      eventType: 'measurement.created',
      createdAt: new Date().toISOString(),
      data: measurement,
    };

    // Beskeden sendes til exchange.
    // RabbitMQ fordeler den videre til alle queues, der subscriber.
    this.channel.publish(
      this.exchangeName,
      '',
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true,
      },
    );

    console.log('Published measurement.created event to RabbitMQ');
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}