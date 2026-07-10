## ADDED Requirements

### Requirement: Icon helper functions
The build SHALL define icon helper functions that return inline SVG strings. Each function SHALL produce an `<svg>` element with `width="1em" height="1em"`, `viewBox="0 0 24 24"`, `fill="currentColor"`, and `aria-hidden="true"`. The icon set SHALL include: iconArrowLeft, iconSearch, iconPerson, iconChevronRight, iconChevronDown, iconStar, iconStarEmpty, iconCheck, iconTruck, iconGift.

#### Scenario: Icon function produces valid inline SVG
- **WHEN** any icon helper function is called
- **THEN** it returns a string containing a complete `<svg>` element with the specified attributes and a valid SVG path

#### Scenario: Icons inherit color from parent
- **WHEN** an icon SVG is rendered inside a colored parent element
- **THEN** the icon renders in `currentColor` (inherits the parent's text color)

### Requirement: Top nav uses SVG icons and real logo
The renderTopNav function SHALL use `iconArrowLeft()` for the back button, an `<img>` tag referencing `tts-logo.png` for the logo, `iconSearch()` for the search icon, and `iconPerson()` for the profile button. No unicode entities SHALL remain in the nav output.

#### Scenario: Nav renders with SVG icons
- **WHEN** renderTopNav() is called
- **THEN** the output contains inline SVG elements for back, search, and profile — and an img tag for the TikTok Shop logo
- **THEN** no `&#` unicode entities appear in the nav HTML

### Requirement: goldStars helper emits SVG stars
The `goldStars(count)` function SHALL return a string of 5 inline SVG star icons. Filled stars (up to `count`) SHALL use `iconStar()` with gold fill color. Empty stars SHALL use `iconStarEmpty()` with stroke only.

#### Scenario: Rating 4.8 renders 5 filled SVG stars
- **WHEN** goldStars(4.8) is called (rounds to 5)
- **THEN** the output contains 5 filled star SVGs and 0 empty star SVGs

#### Scenario: Rating 3 renders 3 filled and 2 empty
- **WHEN** goldStars(3) is called
- **THEN** the output contains 3 filled star SVGs and 2 empty (stroke-only) star SVGs

### Requirement: Chevron icons replace unicode arrows
All instances of `&#8250;` (right chevron) SHALL be replaced with `iconChevronRight()`. All instances of `&#8964;` (down chevron) SHALL be replaced with `iconChevronDown()`. This applies to: price-title seller link, select-options row, about section toggle, and footer accordion headers.

#### Scenario: No unicode chevrons in output
- **WHEN** a full product page is built
- **THEN** the HTML output contains zero instances of `&#8250;` or `&#8964;`
- **THEN** the corresponding locations contain inline SVG chevron icons

### Requirement: Verified check and perk icons use SVG
The review verified badge SHALL use `iconCheck()` instead of `&#10003;`. The footer perk icons SHALL use `iconTruck()` instead of `&#128666;` and `iconGift()` instead of `&#127873;`.

#### Scenario: Review verified badge uses SVG check
- **WHEN** a review card with verified=true is rendered
- **THEN** the verified badge contains an inline SVG check icon, not a unicode character

#### Scenario: Footer perks use SVG icons
- **WHEN** renderFooter() is called
- **THEN** the free-shipping perk uses an inline SVG truck icon
- **THEN** the deals perk uses an inline SVG gift icon

### Requirement: Shelf and also-like star ratings use SVG
The single star indicators in renderSellerShelf and renderAlsoLike SHALL use `iconStar()` instead of the text character `★`.

#### Scenario: Shelf card rating uses SVG star
- **WHEN** a seller shelf card is rendered
- **THEN** the rating line contains an inline SVG star, not a ★ character
