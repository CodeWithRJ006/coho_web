export const isUpcomingEvent = (event) => {
  if (!event || !event.endDate) return false;
  const end = new Date(`${event.endDate}T23:59:59`);
  return end >= new Date();
};

export const getEventLink = (event) => {
  const upcoming = isUpcomingEvent(event);
  if (upcoming) {
    return event.link || '#';
  }
  return event.linkType === 'instagram' || !event.link ? 'https://www.instagram.com/coho.smec/' : event.link;
};

export const EVENTS_DATA = [
  {
    name: "Techno Hunt",
    endDate: "2026-09-28",
    dateLabel: "SEP 28, 2026",
    image: "/assets/events/techno_hunt.jpeg",
    linkType: "form",
    link: "https://forms.gle/LS1eimXSQJbeduVG9",
    colorStart: "rgba(255,170,50,.5)",
    colorEnd: "rgba(255,70,80,.4)"
  },
  {
    name: "CoHo Inauguration & Tech Talk",
    endDate: "2026-09-16",
    dateLabel: "SEP 16, 2026",
    image: "/assets/events/coho_inauguration_techtalk.jpeg",
    linkType: "instagram",
    link: "https://www.instagram.com/coho.smec/",
    colorStart: "rgba(40,190,200,.45)",
    colorEnd: "rgba(60,110,255,.4)"
  },
  {
    name: "Tech Crunch 3.0",
    endDate: "2026-04-29",
    dateLabel: "APR 29, 2026",
    image: "/assets/events/tech_crunch_3.0.jpeg",
    linkType: "instagram",
    link: "https://www.instagram.com/coho.smec/",
    colorStart: "rgba(70,110,255,.55)",
    colorEnd: "rgba(150,70,255,.4)"
  },
  {
    name: "The Origin",
    endDate: "2026-01-23",
    dateLabel: "JAN 22–23, 2026",
    image: "/assets/events/the_origin.jpeg",
    linkType: "instagram",
    link: "https://www.instagram.com/coho.smec/",
    colorStart: "rgba(255,80,70,.5)",
    colorEnd: "rgba(255,150,60,.35)"
  }
];

export const getSortedEvents = (events = EVENTS_DATA) => {
  const upcoming = events.filter(isUpcomingEvent).sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  const past = events.filter(e => !isUpcomingEvent(e)).sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
  return [...upcoming, ...past];
};
