export default function formatDateTime(datetime: any) {
  const date = new Date(datetime);

  type DateFormatOptions = {
    day: "2-digit";
    month: "short";
  };

  // Format the date as "dd-mmm"
  const dateFormatOptions: DateFormatOptions = { day: "2-digit", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", dateFormatOptions);
  const [month, day] = formattedDate.split(" ");
  const formattedDateReverse = `${day} ${month}`;

  type TimeFormatOptions = {
    hour: "2-digit";
    minute: "2-digit";
  };

  // Format the time
  const timeFormatOptions: TimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  const formattedTime = date.toLocaleTimeString("en-US", timeFormatOptions);

  // Combine the formatted date and time
  return `${formattedDateReverse} ${formattedTime}`;
}
