import { describe, it, expect, vi } from 'vitest';
import { trackContactFormSubmission } from '@utils/contact-tracking';

describe('trackContactFormSubmission', () => {
  const event = { websiteId: 'abc-123', url: '/contact/' };

  it('queues the event through sendBeacon so it survives the page navigating away', () => {
    const sendBeacon = vi.fn().mockReturnValue(true);

    const queued = trackContactFormSubmission(event, sendBeacon);

    expect(queued).toBe(true);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon).toHaveBeenCalledWith('/api/send', expect.any(String));
  });

  it('reports back when the browser refuses to queue the beacon', () => {
    const sendBeacon = vi.fn().mockReturnValue(false);

    expect(trackContactFormSubmission(event, sendBeacon)).toBe(false);
  });

  it('sends the same event data the contact button used to track on click', () => {
    const sendBeacon = vi.fn().mockReturnValue(true);

    trackContactFormSubmission(event, sendBeacon);

    const body = JSON.parse(sendBeacon.mock.calls[0][1]);
    expect(body.payload).toMatchObject({
      website: 'abc-123',
      url: '/contact/',
      name: 'Click',
      data: { type: 'form', location: 'contact-form', label: 'Envoyer le message' },
    });
  });
});
