import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "../Calender.module.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to load events:", err));
  }, []);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const calendarDays = [];
  let day = startDate;

  while (day.isBefore(endDate, "day") || day.isSame(endDate, "day")) {
    calendarDays.push(day);
    day = day.add(1, "day");
  }

  const handlePrev = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNext = () => setCurrentDate(currentDate.add(1, "month"));

  const renderEvents = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    const dayEvents = events.filter((e) => e.date === dateStr);

    return dayEvents.map((event, idx) => (
      <div key={idx} className={styles.event}>
        <small>
          {event.time} - {event.title}
        </small>
      </div>
    ));
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button onClick={handlePrev}>Prev</button>
        <h2>{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={handleNext}>Next</button>
      </div>

      <div className={styles.calendarGrid}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className={styles.calendarDayHeader}>
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => {
          const isToday = date.isSame(dayjs(), "day");
          return (
            <div
              key={index}
              className={`${styles.calendarCell} ${
                isToday ? styles.today : ""
              }`}
            >
              <div className={styles.dateNumber}>{date.date()}</div>
              {renderEvents(date)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
