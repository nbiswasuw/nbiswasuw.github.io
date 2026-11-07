# Updating your website

Open `index.html` to preview. No installation, build step, or backend is needed.
Upload the contents of this folder to your existing hosting location. Keep your existing resume PDFs beside index.html; PDFs were not supplied in this request.

## One file for routine updates

Edit **assets/js/content.js**. It contains four labeled lists: `news`, `collaborators`, `projects`, and `publications`. Each item is a small block of text. Copy an existing block, change its values, and keep the commas between blocks. Use double quotes around strings; escape a quotation mark inside text as `\"`.

- News: edit `date`, `category`, `title`, `description`, `image`, and `url`. Put newest entries first. The first ten appear as slides with circles; all appear on news.html. Empty image or URL values are allowed. Visitors can use circles, arrows, or Play/Pause.
- Collaborators: edit `name`, `logo`, and optional `url`. Add logos to images/collaborators/.
- Projects: edit `title`, `summary`, `image`, and `url`. These appear above the original detailed experience section.
- Publications: edit `title`, `citation`, `summary`, `url`, and `group`. The group must be one of `Journal articles & published work`, `Other publications`, or `Conferences & presentations`. Add new items near the top of the appropriate group.

Example news item (insert inside the news list):

```javascript
{
  "date": "2026-11-07",
  "category": "Talk",
  "title": "Your presentation title",
  "description": "One or two sentences about the presentation.",
  "image": "images/your-photo.jpg",
  "url": "https://example.org/your-event"
},
```

## Appearance

Edit the color values at the beginning of **assets/css/refresh.css**. Original template styles and background images remain in assets/css/main.css. **assets/js/refresh.js** handles rendering; routine updates do not require editing it.

## Content notes

All original publications and conference citations were retained, including the duplicated Digital Twins citation already in the source. Publication summaries are conservative draft descriptions based on the supplied titles; review them for scientific nuance. Older news remains in the archive, while 2026 publication highlights come from the supplied homepage. No new talks, visits, or institutional partnerships were invented. Existing external links and time-sensitive biography statements have not been independently checked.

The publication HTML contains a static initial fallback. With JavaScript enabled, content.js is authoritative. If you require a fully current no-JavaScript publication list, update that HTML fallback as well.

HydroTelliSense, Bangladesh SWOT Visualizer, and RIQSA appear first in the project overview. Their titles, descriptions, and links can be edited in the same projects list.

## Expanded sections and publication filters

All routine content remains in assets/js/content.js:

- `researchStory`: paragraphs for the general research narrative.
- `innovations`: URLs of entries in `projects` to feature near the research story. Keep HydroTelliSense and RIQSA here, or replace the URLs to change the highlights.
- `projects`: the single combined list for Projects, Tools & Frameworks, including historical contributions. Edit `status`, `summary`, and `linkLabel` without claiming a legacy system is still operational.
- `experience`: brief role and contribution summaries, separate from the project portfolio.
- `services`: editorial work, peer review, training, mentoring, open science, assessment contributions, outreach, and professional societies.
- `settings.newsSlideLimit`: 10. Increase or decrease this number to change the carousel length.

Each publication now has a numeric `number` and a `categories` list. Keep the number out of the `citation` text: it is displayed automatically in the bold linked title. The number stays fixed when filtering. Original numbering is retained separately within the publication and conference groups.

Allowed category labels are exactly `Remote Sensing`, `Modelling`, `AI and ML`, and `Climate Change`. A paper may have several labels, for example:

```javascript
"number": 28,
"categories": ["Remote Sensing", "AI and ML"]
```

The category buttons filter entries while retaining their publication/conference grouping. All restores the complete list. Topic labels are editorial classifications based on the supplied titles and descriptions; refine them as you review the papers.
