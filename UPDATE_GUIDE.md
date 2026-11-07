# Updating your website

Extract this folder and open **index.html** to preview. Upload its contents to your existing hosting location. No build step or backend is required. Keep your existing resume PDFs beside index.html; they were not supplied with this update.

## Your content file

Routine changes go in **assets/js/content.js**. Copy an existing item, edit its fields, and retain the commas between items. Keep text inside double quotes; escape quotation marks within a string as `\"`.

| Content | Where to edit | What to change |
| --- | --- | --- |
| Latest updates | `news` | date, category, title, description, image, url. Put newest first. |
| Number of update slides | `settings.newsSlideLimit` | Currently 10. |
| Research story | `researchStory` | One string per paragraph. |
| Latest innovations | `innovations` | URLs of the entries to feature from `projects`. |
| Projects, Tools & Frameworks | `projects` | title, summary, image, url, status, linkLabel. |
| Publications | `publications` | number, title, citation, summary, url, group, categories. |
| Experience | `experience` | title and summary. |
| Service & Engagement | `services` | title, summary, optional url. |
| Collaborators | `collaborators` | name, logo, optional url. |
| Funding | `funding` | Add the records described below. |
| Photo gallery | `gallery` | image and caption for each slot. |

The original Scope One font is restored. Appearance overrides are in **assets/css/refresh.css**; the original template and background-image rules remain in **assets/css/main.css**. Rendering and carousel controls are in **assets/js/refresh.js**.

## Screenshots and the Colombia placeholder

HydroTelliSense, RIQSA, and the Bangladesh SWOT Visualizer use screenshots in **images/screenshots/**. Each screenshot links to its project's website. Set `screenshot: true` to show a complete screenshot without cropping it.

The Colombia landslide-mapping entry has `image: ""` and `imagePlaceholder: true`. To fill its reserved space, put your screenshot in images/screenshots/ and change just that entry's image path, for example:

```javascript
"image": "images/screenshots/colombia-landslides.jpg",
"screenshot": true,
"imagePlaceholder": true
```

The same project record supplies both its innovation card and its tools-section card.

## Publication categories and numbering

Use one or more exact category labels: **Remote Sensing**, **Modelling**, **AI and ML**, **Climate Change**, **Natural Hazards**. Flood, flash flood, and landslide papers are included in Natural Hazards. These are editable thematic classifications, and an entry can belong to several topics.

```javascript
"number": 28,
"categories": ["Remote Sensing", "Natural Hazards"]
```

Keep the number out of `citation`: it appears automatically in the bold title and stays fixed when filtering. Original numbering is retained within the publication/conference groups. `group` must be one of `Journal articles & published work`, `Other publications`, or `Conferences & presentations`.

The HTML includes an initial static publication fallback. With JavaScript enabled, content.js is authoritative. Update the HTML fallback too if you need it to mirror later changes without JavaScript.

## Photo gallery: 20 ready-to-fill slots

The gallery is the last section, immediately after collaborators. Each of its 20 slots starts with an empty image and caption, so no sample photograph is mistaken for your work. Fill each record like this:

```javascript
{
  "image": "images/gallery/my-photo-01.jpg",
  "caption": "Your description of the event, people, place, or activity."
}
```

Create **images/gallery/** and add your photographs there. Remove unused empty records if you want only 15 photos. Copy a record to add more than 20. The arrows, circle selectors, counter, and Play/Pause controls adjust automatically. Captions appear below the image. Landscape and portrait images are shown in full.

## Funding: ready for your details

The section is intentionally empty. Replace `funding: []` with records such as the following (replace every example value with your actual details):

```javascript
"funding": [
  {
    "title": "Project or award title",
    "sponsor": "Funding organization",
    "period": "2026–2028",
    "role": "Your role",
    "summary": "Brief description of the funded work.",
    "url": "https://example.org/award"
  }
]
```

Leave optional values blank to omit them. No funding awards or amounts have been invented.

## Content notes

Publication summaries are draft scope descriptions based on your supplied titles. Review them for scientific nuance. The duplicated Digital Twins citation from your original source has been retained. Older tools are described as research and development contributions without claiming that they are still operational. Time-sensitive biography statements and existing external links have not all been independently rechecked.
