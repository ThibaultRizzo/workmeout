import moment from "moment";

export const timeToSeconds = (time) => {
  // time should be "mm:ss"
  return moment.duration("00:" + time).asSeconds();
};

export const secondsToHumanDuration = (seconds) => {
  return moment.duration(seconds * 1000).humanize();
};
