import { describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

type Atlas = {
  name: string;
  path: string;
  title: string;
  hero: string;
  nav: { link: string; heading: string };
  tides: {
    first: { tab: string; heading: string };
    last: { tab: string; heading: string };
  };
  cast: {
    query: string;
    match: string;
    other: string;
    group: string;
    groupMatch: string;
    groupOther: string;
    blockedQuery: string;
  };
  quiz: { correct: string; wrong: string; why: string };
  backToTop: boolean;
};

const atlases: Atlas[] = [
  {
    name: 'Odyssey',
    path: '/examples/odyssey-memory-atlas.html',
    title: 'Odysseus · A Memory Atlas',
    hero: 'Odysseus at sea.',
    nav: { link: 'Cast', heading: 'People, gods & creatures' },
    tides: {
      first: { tab: '01 · The missing king', heading: 'While the hero is away' },
      last: { tab: '05 · The bow and the bed', heading: 'The homecoming is a reckoning' },
    },
    cast: {
      query: 'Penelope',
      match: 'Penelope',
      other: 'Polyphemus',
      group: 'Gods',
      groupMatch: 'Athena',
      groupOther: 'Odysseus',
      blockedQuery: 'Penelope',
    },
    quiz: {
      correct: 'So the other Cyclopes will not understand who attacked him',
      wrong: 'Because he has forgotten his real name',
      why: "Poseidon's lasting anger",
    },
    backToTop: true,
  },
  {
    name: 'Project Hail Mary',
    path: '/examples/project-hail-mary-memory-atlas.html',
    title: 'Project Hail Mary · A Memory Atlas',
    hero: 'Project Hail Mary.',
    nav: { link: 'Science', heading: 'Remember it as a chain' },
    tides: {
      first: { tab: '01 · Wake up', heading: 'A stranger in his own body' },
      last: { tab: '05 · The legacy', heading: 'The teacher returns to teaching' },
    },
    cast: {
      query: 'Stratt',
      match: 'Eva Stratt',
      other: 'Rocky',
      group: 'Eridians',
      groupMatch: 'Rocky',
      groupOther: 'Eva Stratt',
      blockedQuery: 'Stratt',
    },
    quiz: {
      correct:
        'Because he brings a second world, a second science, and a relationship built through translation',
      wrong: 'Because the Eridians created astrophage',
      why: 'a shared solution between two civilizations',
    },
    backToTop: false,
  },
];

for (const atlas of atlases) {
  describe(atlas.name, () => {
    test('opens on the guide title', async ({ app, screen, browser }) => {
      await app.open(atlas.path);
      await expect(browser).toHaveTitle(atlas.title);
      await expect(screen.getByRole('heading', { level: 1 })).toHaveText(atlas.hero);
    });

    test('follows a section link', async ({ app, screen, browser }) => {
      await app.open(atlas.path);
      await screen.getByRole('link', atlas.nav.link).click();
      await expect(browser).toHaveURL(new RegExp(`#${atlas.nav.link.toLowerCase()}$`));
      await expect(screen.getByRole('heading', atlas.nav.heading)).toBeVisible();
    });

    test('switches story tides and leaves the others closed', async ({ app, screen }) => {
      await app.open(atlas.path);
      await expect(screen.getByRole('heading', atlas.tides.first.heading)).toBeVisible();
      await expect(screen.getByRole('heading', atlas.tides.last.heading)).toBeHidden();

      await screen.getByRole('button', atlas.tides.last.tab).click();

      await expect(screen.getByRole('heading', atlas.tides.last.heading)).toBeVisible();
      await expect(screen.getByRole('heading', atlas.tides.first.heading)).toBeHidden();
      await expect(screen.getByRole('button', atlas.tides.last.tab)).toHaveAttribute('class', /active/);
    });

    test('searches the cast, then filters by group', async ({ app, screen }) => {
      await app.open(atlas.path);
      const search = screen.getByPlaceholder('Search the cast…');

      await search.fill(atlas.cast.query);
      await expect(screen.getByRole('heading', atlas.cast.match)).toBeVisible();
      await expect(screen.getByRole('heading', atlas.cast.other)).toBeHidden();

      await search.fill('');
      await screen.getByRole('button', atlas.cast.group).click();
      await expect(screen.getByRole('heading', atlas.cast.groupMatch)).toBeVisible();
      await expect(screen.getByRole('heading', atlas.cast.groupOther)).toBeHidden();

      await search.fill(atlas.cast.blockedQuery);
      await expect(screen.getByRole('heading', atlas.cast.groupMatch)).toBeHidden();
      await expect(screen.getByRole('heading', atlas.cast.groupOther)).toBeHidden();

      await search.fill('');
      await screen.getByRole('button', 'All').click();
      await expect(screen.getByRole('heading', atlas.cast.match)).toBeVisible();
      await expect(screen.getByRole('heading', atlas.cast.other)).toBeVisible();
    });

    test('toggles night mode and restores day mode', async ({ app, screen, browser }) => {
      await app.open(atlas.path);
      const theme = screen.getByRole('button', 'Toggle dark mode');

      await theme.click();
      await expect(theme).toHaveText('☀');
      await expect(browser.locator('body')).toHaveAttribute('class', /night/);

      await theme.click();
      await expect(theme).toHaveText('☾');
      await expect(browser.locator('body')).toHaveAttribute('class', /^$/);
    });

    test('marks a correct quiz answer and explains it', async ({ app, screen }) => {
      await app.open(atlas.path);
      const feedback = screen.getByRole('status');
      await expect(feedback).toBeHidden();

      await screen.getByRole('button', atlas.quiz.correct).click();

      const chosen = screen.getByRole('button', atlas.quiz.correct);
      await expect(chosen).toHaveAttribute('class', /correct/);
      await expect(chosen).toBeDisabled();
      await expect(screen.getByRole('button', atlas.quiz.wrong)).toBeDisabled();
      await expect(feedback).toBeVisible();
      await expect(feedback).toContainText('Correct.');
      await expect(feedback).toContainText(atlas.quiz.why);
    });

    test('a wrong quiz answer is not called correct', async ({ app, screen }) => {
      await app.open(atlas.path);
      await screen.getByRole('button', atlas.quiz.wrong).click();

      const chosen = screen.getByRole('button', atlas.quiz.wrong);
      const feedback = screen.getByRole('status');
      await expect(chosen).toHaveAttribute('class', /wrong/);
      await expect(chosen).toBeDisabled();
      await expect(screen.getByRole('button', atlas.quiz.correct)).toBeDisabled();
      await expect(feedback).toBeVisible();
      await expect(feedback).toContainText('Not quite.');
      await expect(feedback).toContainText(atlas.quiz.why);
    });
  });
}

test('the Odyssey guide returns to the top after a long scroll', async ({ app, screen, browser }) => {
  await app.open('/examples/odyssey-memory-atlas.html');
  const back = screen.getByRole('button', 'Back to top');
  await expect(back).toBeHidden();

  await browser.evaluate(() => window.scrollTo(0, 900));
  await expect(back).toBeVisible();
  const width = await browser.evaluate(() => getComputedStyle(document.getElementById('progress')!).width);
  expect(width).not.toBe('0px');

  await back.click();
  await expect.poll(async () => browser.evaluate(() => window.scrollY), { timeout: 10_000 }).toBe(0);
  await expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
});
