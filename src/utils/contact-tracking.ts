export type SendBeacon = (url: string, data: string) => boolean;

export interface ContactSubmissionEvent {
  websiteId: string;
  url: string;
}

const COLLECT_ENDPOINT = '/api/send';

/**
 * A click listener firing an async fetch races the form's native submit
 * navigation, which can abort the request before Umami records it.
 * navigator.sendBeacon (passed in as sendBeacon) is queued by the browser
 * before unload and delivered afterwards, so the submission is never lost.
 */
export function trackContactFormSubmission(event: ContactSubmissionEvent, sendBeacon: SendBeacon): boolean {
  const body = JSON.stringify({
    type: 'event',
    payload: {
      website: event.websiteId,
      url: event.url,
      name: 'Click',
      data: { type: 'form', location: 'contact-form', label: 'Envoyer le message' },
    },
  });

  return sendBeacon(COLLECT_ENDPOINT, body);
}
