import 'package:flutter_test/flutter_test.dart';
import 'package:smart_air_app/main.dart';

void main() {
  testWidgets('Smart Air app starts on login screen', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const SmartAirApp());

    expect(find.text('Smart Air Quality'), findsOneWidget);
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
  });
}
