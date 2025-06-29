import { format, isToday, isYesterday } from "date-fns";

const groupWatchHistoryByDate = (history = []) => {
  const grouped = {};

  history.forEach((entry) => {
    const watchedDate = new Date(entry.watchedAt);

    let label;
    if (isToday(watchedDate)) {
      label = "Today";
    } else if (isYesterday(watchedDate)) {
      label = "Yesterday";
    } else {
      label = format(watchedDate, "MMMM d, yyyy");
    }

    if (!grouped[label]) {
      grouped[label] = [];
    }

    grouped[label].push(entry);
  });

  return grouped;
};

export default groupWatchHistoryByDate;
