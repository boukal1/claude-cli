import { TestBed } from '@angular/core/testing';
import { DeckService, DECK_SLIDES } from './deck.service';
import { SlideConfig } from './slide-config';

const FAKE_SLIDES: SlideConfig[] = [
  { kind: 'title', title: 'A' },
  { kind: 'title', title: 'B' },
  { kind: 'title', title: 'C' },
  { kind: 'faq', question: 'Q1?', answer: 'A1', group: 'faq' },
  { kind: 'faq', question: 'Q2?', answer: 'A2', group: 'faq' },
];

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DECK_SLIDES, useValue: FAKE_SLIDES }],
    });
    service = TestBed.inject(DeckService);
  });

  it('starts at index 0', () => {
    expect(service.currentIndex()).toBe(0);
  });

  it('next() increments, bounded at last index', () => {
    service.next();
    expect(service.currentIndex()).toBe(1);
    service.goTo(FAKE_SLIDES.length - 1);
    service.next();
    expect(service.currentIndex()).toBe(FAKE_SLIDES.length - 1);
  });

  it('prev() decrements, bounded at 0', () => {
    service.goTo(2);
    service.prev();
    expect(service.currentIndex()).toBe(1);
    service.goTo(0);
    service.prev();
    expect(service.currentIndex()).toBe(0);
  });

  it('goTo clamps out-of-range indices', () => {
    service.goTo(-5);
    expect(service.currentIndex()).toBe(0);
    service.goTo(999);
    expect(service.currentIndex()).toBe(FAKE_SLIDES.length - 1);
  });

  it('first() and last() jump to bounds of the main group', () => {
    service.last();
    expect(service.currentIndex()).toBe(2); // last main slide, not last FAQ
    service.first();
    expect(service.currentIndex()).toBe(0);
  });

  it('jumpToFaq(0) jumps to the first FAQ slide', () => {
    service.jumpToFaq(0);
    expect(service.current()?.kind).toBe('faq');
  });

  it('jumpToFaq out-of-range clamps to the last FAQ', () => {
    service.jumpToFaq(99);
    const current = service.current();
    expect(current?.kind).toBe('faq');
    expect((current as { question: string }).question).toBe('Q2?');
  });
});
