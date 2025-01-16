export const formatDateStyle = (date: Date) => {
  const currentYear = new Date().getFullYear();
  const targetYear = date.getFullYear();

  return `${currentYear === targetYear ? "" : `${targetYear}년 `}${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const formatRelativeTime = (date: Date) => {
  const MS_IN = {
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    week: 1000 * 60 * 60 * 24 * 7,
  };

  const targetTime = date.getTime();
  const currentTime = Date.now();
  const diffTime = targetTime - currentTime;

  const formatter = new Intl.RelativeTimeFormat("ko");
  const formatTime = (unit: keyof typeof MS_IN, value: number) => {
    return formatter.format(Math.round(value / MS_IN[unit]), unit);
  };

  if (Math.abs(diffTime) < MS_IN.hour) {
    return formatTime("minute", diffTime);
  }

  if (Math.abs(diffTime) < MS_IN.day) {
    return formatTime("hour", diffTime);
  }

  if (Math.abs(diffTime) < MS_IN.week) {
    return formatTime("day", diffTime);
  }

  return formatDateStyle(date);
};
