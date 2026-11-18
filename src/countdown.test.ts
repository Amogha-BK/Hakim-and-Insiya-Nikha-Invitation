import assert from "node:assert/strict";
import test from "node:test";
import { getCountdownParts } from "./countdown.ts";
import { invitationConfig } from "./invitationConfig.ts";

const nikah = invitationConfig.celebrations.find(event => event.id === "nikah")!;
const ceremony = invitationConfig.celebrations.find(event => event.id === "reception")!;
const target = Date.parse(invitationConfig.countdownTarget);

test("the Hyderabad Nikah is after Maghrib on 9 January 2027", () => {
  assert.equal(nikah.start.slice(0, 10), "2027-01-09");
  assert.equal(nikah.supportingLine, "Nikah after Maghrib, followed by dinner.");
});

test("the Kerala wedding ceremony starts at 11 a.m. IST on 16 January 2027", () => {
  assert.equal(new Date(ceremony.start).toISOString(), "2027-01-16T05:30:00.000Z");
  assert.equal(ceremony.timeLabel, "11 AM to 3 PM");
});

test("countdown reaches zero at the start of 9 January in India", () => {
  assert.equal(new Date(target).toISOString(), "2027-01-08T18:30:00.000Z");
});

test("counts down across December and January in IST", () => {
  assert.deepEqual(getCountdownParts(target, Date.parse("2026-12-13T14:26:50+05:30")), {
    days: 26, hours: 9, minutes: 33, seconds: 10, complete: false,
  });
});

test("equivalent international clock readings give the same countdown", () => {
  const ist = Date.parse("2027-01-08T00:00:00+05:30");
  const utc = Date.parse("2027-01-07T18:30:00Z");
  const newYork = Date.parse("2027-01-07T13:30:00-05:00");
  const expected = { days: 1, hours: 0, minutes: 0, seconds: 0, complete: false };
  for (const now of [ist, utc, newYork]) assert.deepEqual(getCountdownParts(target, now), expected);
});

test("midnight on the wedding date completes the countdown", () => {
  assert.deepEqual(getCountdownParts(target, Date.parse("2027-01-09T00:00:00+05:30")), {
    days: 0, hours: 0, minutes: 0, seconds: 0, complete: true,
  });
});

test("does not finish a fraction of a second before 9 January", () => {
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
