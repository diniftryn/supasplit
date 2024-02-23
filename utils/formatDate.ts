export default function formatDateTime(datetime: any) {
  const date = new Date(datetime);

  // Format the date as "dd-mmm"
  const dateFormatOptions = { day: "2-digit", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", dateFormatOptions);
  const [month, day] = formattedDate.split(" ");
  const formattedDateReverse = `${day} ${month}`;

  // Format the time
  const timeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  const formattedTime = date.toLocaleTimeString("en-US", timeFormatOptions);

  // Combine the formatted date and time
  return `${formattedDateReverse} ${formattedTime}`;
}
