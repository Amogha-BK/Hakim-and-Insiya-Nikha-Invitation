import assert from "node:assert/strict";
import test from "node:test";
import { getCountdownParts } from "./countdown.ts";
import { invitationConfig } from "./invitationConfig.ts";
import { toTemplateConfig, validateRecord } from "./invitation/schema.ts";

const invitation = toTemplateConfig(validateRecord(invitationConfig));
const target = Date.parse(invitation.countdownTarget);

test("the invitation record keeps the three Pune events, timings and couple illustration after validation", () => {
  const [mehendi, nikah, reception] = invitation.celebrations;
  assert.deepEqual(invitation.display.names, ["Hakim", "Insiya"]);
  assert.equal(invitation.media.portraitUrl, "/assets/hakim-insiya-seated-portrait.webp");
  assert.equal(invitation.media.portraitHighResUrl, "/assets/hakim-insiya-seated-portrait-4k.webp");
  assert.equal(mehendi.dateLabel, "Friday, 22 January 2027");
  assert.equal(mehendi.timeLabel, "10:00 am onwards");
  assert.equal(nikah.dateLabel, "Saturday, 23 January 2027");
  assert.equal(nikah.timeLabel, "Shitabi at 6:30 pm");
  assert.equal(nikah.scheduleNote, "Majlis at 7:30 pm");
  assert.equal(nikah.hijriDate, "16th Shabanul Karim, 1448 H");
  assert.equal(reception.dateLabel, "Sunday, 24 January 2027");
  assert.equal(reception.timeLabel, "7:30 pm onwards");
  assert.equal(reception.scheduleNote, undefined);
});

test("countdown reaches zero at the start of 23 January in India", () => {
  assert.equal(new Date(target).toISOString(), "2027-01-22T18:30:00.000Z");
});

test("counts down across December and January in IST", () => {
  assert.deepEqual(getCountdownParts(target, Date.parse("2026-12-13T14:26:50+05:30")), {
    days: 40, hours: 9, minutes: 33, seconds: 10, complete: false,
  });
});

test("equivalent international clock readings give the same countdown", () => {
  const ist = Date.parse("2027-01-22T00:00:00+05:30");
  const utc = Date.parse("2027-01-21T18:30:00Z");
  const newYork = Date.parse("2027-01-21T13:30:00-05:00");
  const expected = { days: 1, hours: 0, minutes: 0, seconds: 0, complete: false };
  for (const now of [ist, utc, newYork]) assert.deepEqual(getCountdownParts(target, now), expected);
});

test("midnight on the wedding date completes the countdown", () => {
  assert.deepEqual(getCountdownParts(target, Date.parse("2027-01-23T00:00:00+05:30")), {
    days: 0, hours: 0, minutes: 0, seconds: 0, complete: true,
  });
});

test("does not finish a fraction of a second before 23 January", () => {
  assert.deepEqual(getCountdownParts(target, target - 1), {
    days: 0, hours: 0, minutes: 0, seconds: 1, complete: false,
  });
});

test("finishes on the wedding date and never shows negative values", () => {
  for (const now of [target, target + 86400000]) {
    assert.deepEqual(getCountdownParts(target, now), {
      days: 0, hours: 0, minutes: 0, seconds: 0, complete: true,
    });
  }
});

test("updates days, hours, minutes and seconds as the current time advances", () => {
  assert.deepEqual(getCountdownParts(target, target - 86401000), {
    days: 1, hours: 0, minutes: 0, seconds: 1, complete: false,
  });
  assert.deepEqual(getCountdownParts(target, target - 86400000), {
    days: 1, hours: 0, minutes: 0, seconds: 0, complete: false,
  });
  assert.deepEqual(getCountdownParts(target, target - 86399000), {
    days: 0, hours: 23, minutes: 59, seconds: 59, complete: false,
  });
});
