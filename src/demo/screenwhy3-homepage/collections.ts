import type { HomeTheme, HomeCollection } from "@/features/homepage3/types";
export const DEMO_THEMES: readonly HomeTheme[] = [
  {
    "id": "demo:theme:001",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Horror",
    "kind": "genre",
    "description": "Dread with a reason"
  },
  {
    "id": "demo:theme:002",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Thriller",
    "kind": "genre",
    "description": "Every second changes the story"
  },
  {
    "id": "demo:theme:003",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Mystery",
    "kind": "genre",
    "description": "Follow what the clues reveal"
  },
  {
    "id": "demo:theme:004",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Sci-Fi",
    "kind": "genre",
    "description": "Ideas beyond the obvious"
  },
  {
    "id": "demo:theme:005",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Drama",
    "kind": "genre",
    "description": "Feel what remains unsaid"
  },
  {
    "id": "demo:theme:006",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Crime",
    "kind": "genre",
    "description": "Truth beneath appearances"
  },
  {
    "id": "demo:theme:007",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Fantasy",
    "kind": "genre",
    "description": "Worlds with their own rules"
  },
  {
    "id": "demo:theme:008",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Romance",
    "kind": "genre",
    "description": "Stories between people"
  },
  {
    "id": "demo:theme:009",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Animation",
    "kind": "genre",
    "description": "Wonder drawn to life"
  },
  {
    "id": "demo:theme:010",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Time Loops",
    "kind": "theme",
    "description": "One moment, many meanings"
  },
  {
    "id": "demo:theme:011",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Unreliable Narrators",
    "kind": "theme",
    "description": "When the telling shifts"
  },
  {
    "id": "demo:theme:012",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "label": "Slow-Burn Suspense",
    "kind": "mood",
    "description": "Tension worth lingering over"
  }
] as const;
export const DEMO_COLLECTIONS: readonly HomeCollection[] = [
  {
    "id": "demo:collection:001",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "The Unsolved Hour",
    "note": "Stories built around unanswered questions",
    "movieIds": [
      "demo:movie:003",
      "demo:movie:008",
      "demo:movie:018",
      "demo:movie:031",
      "demo:movie:039",
      "demo:movie:047"
    ]
  },
  {
    "id": "demo:collection:002",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "After the Last Frame",
    "note": "Final acts that ask for another look",
    "movieIds": [
      "demo:movie:001",
      "demo:movie:010",
      "demo:movie:016",
      "demo:movie:022",
      "demo:movie:034",
      "demo:movie:043"
    ]
  },
  {
    "id": "demo:collection:003",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "Cities After Dark",
    "note": "Nocturnal journeys into shifting places",
    "movieIds": [
      "demo:movie:002",
      "demo:movie:006",
      "demo:movie:017",
      "demo:movie:028",
      "demo:movie:036",
      "demo:movie:041"
    ]
  },
  {
    "id": "demo:collection:004",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "Beyond the Horizon",
    "note": "Imaginative worlds, unfamiliar stakes",
    "movieIds": [
      "demo:movie:005",
      "demo:movie:011",
      "demo:movie:023",
      "demo:movie:032",
      "demo:movie:042",
      "demo:movie:048"
    ]
  },
  {
    "id": "demo:collection:005",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "Strange Familiar Things",
    "note": "Everyday settings with an uncanny edge",
    "movieIds": [
      "demo:movie:004",
      "demo:movie:012",
      "demo:movie:019",
      "demo:movie:030",
      "demo:movie:035",
      "demo:movie:045"
    ]
  },
  {
    "id": "demo:collection:006",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "Connections & Departures",
    "note": "Tenderness, memory, and difficult choices",
    "movieIds": [
      "demo:movie:007",
      "demo:movie:014",
      "demo:movie:026",
      "demo:movie:033",
      "demo:movie:040",
      "demo:movie:044"
    ]
  },
  {
    "id": "demo:collection:007",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "Signals in the Noise",
    "note": "Clues hiding in plain sight",
    "movieIds": [
      "demo:movie:013",
      "demo:movie:015",
      "demo:movie:020",
      "demo:movie:027",
      "demo:movie:037",
      "demo:movie:046"
    ]
  },
  {
    "id": "demo:collection:008",
    "source": "screenwhy3_demo",
    "isDemo": true,
    "title": "Unwritten Futures",
    "note": "What happens when tomorrow changes",
    "movieIds": [
      "demo:movie:009",
      "demo:movie:021",
      "demo:movie:024",
      "demo:movie:025",
      "demo:movie:029",
      "demo:movie:038"
    ]
  }
] as const;
