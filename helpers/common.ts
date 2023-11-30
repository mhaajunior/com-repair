export const ifNull = (message: string | null | undefined) => {
  return message ? message : "-";
};

export const secondsToDhms = (seconds: number) => {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600 * 24));
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);

  let dDisplay = d > 0 ? d + " วัน " : "";
  let hDisplay = h > 0 ? h + " ชั่วโมง " : "";
  let mDisplay = m > 0 ? m + " นาที " : "";
  let sDisplay = s > 0 ? s + " วินาที" : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};
