import { CalendarPanel } from "../domains/calendar";
import { ChatPanel } from "../domains/chat";
import { ClockPanel } from "../domains/clock";
import { NotificationsPanel } from "../domains/notifications";
import { RemindersPanel } from "../domains/reminders";
import { HealthProvider, StatusBar } from "../domains/system";
import { WeatherPanel } from "../domains/weather";
import { DashboardLayout } from "./DashboardLayout";
// import "../styles/index.css";

export function App() {
  return (
    <HealthProvider>
      <DashboardLayout
        statusBar={<StatusBar />}
        left={
          <>
            <ClockPanel />
            <CalendarPanel />
            <NotificationsPanel />
          </>
        }
        center={<ChatPanel />}
        right={
          <>
            <WeatherPanel />
            <RemindersPanel />
          </>
        }
      />
    </HealthProvider>
  );
}
