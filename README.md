# social-visualization

[Social Visualization](https://social-visualization.vercel.app) is a web application built to consume [Upfluence's](https://www.upfluence.com) real-time data stream via SSE. The goal is to provide a dynamic and interactive 3D visualization of these data points, allowing users to explore social post trends in an intuitive and seamless way. The application is designed with a responsive user experience.


## Technologies Used

Ember.js → JavaScript framework structuring the application.

D3.js → Data visualization library for rendering dynamic graphs.

SSE (Server-Sent Events) → Real-time data updates handled through EventSource.
## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Installation

- `git clone https://github.com/JohanTorosjan/social-visualization.git` 
- `cd social-visualization`
- `npm install`


## Running / Development

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).


### Running Tests

- `npm run test`
- `npm run test:ember -- --server`

### Linting

- `npm run lint`
- `npm run lint:fix`

### Building

- `npm exec ember build` (development)
- `npm run build` (production)

### Deployment 
The application is deployed on Vercel for easy access. To deploy your own version, follow these steps:
Install Vercel CLI:
`npm install -g vercel`
Login to Vercel:
`vercel login`
Deploy the project:
`vercel`

The deployment link will be provided by Vercel after successful deployment.


## Features

### postStream Service

- Centralizes the SSE (EventSource) stream management.
- Retrieves and structures incoming posts in real time.
- Ensures separation between data logic and UI components.

### PostGraph Component

- Allows navigation between different post types (TikTok, YouTube, Instagram, etc.).
- Manages the display of the corresponding graph for the selected type.
- Follows Ember best practices with efficient state management via tracked.

### Graph Component (D3.js)

- Integrates D3.js to render a scalable interactive graph.
- Optimized updates via an Ember modifier, ensuring efficient rendering.
- Displays data on a time-based scale (day & hour).
- User interaction management with dynamic tooltips.

### Header Component

- Displays the main title and real-time post counter.
- Button to pause/resume the SSE stream, improving user experience.

## Architecture & Technical Decisions

### Technical Choices

Ember.js was chosen for its well-defined structure and ease of state management.

D3.js was selected for its advanced data visualization capabilities.

Service-based architecture separates data retrieval logic from UI components.

Ember modifiers are used to optimize interaction between graphs and data.

### Trade-offs & Future Improvements
- Lack of automated tests: Due to time constraints and the simplicity of the application, no unit or integration tests were written. If more time was available, testing would be prioritized.
- Enhanced SSE error handling could improve system resilience.
- A heatmap feature could be added for better trend analysis.
- Local storage caching could optimize post management over time.
- Scalability considerations: The app performs well with moderate data flow but could benefit from caching mechanisms and virtualization techniques for higher traffic.


## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
