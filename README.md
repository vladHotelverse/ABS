# Hotel Booking Experience

This project is a single-page web application that provides a user interface for a hotel booking system. It allows users to select rooms, customize their stay, choose special offers, and view a summary of their booking.

## Project Structure

The project is organized as follows:

- **HTML Files:**
    - `index.html`: The main entry point for the Spanish version of the website.
    - `indexEn.html`: The main entry point for the English version of the website.
    - `indexEs.html`: An alias or alternative entry point for the Spanish version of the website.
- **`components/` Directory:** Contains reusable HTML snippets for different sections of the website, such as the header, booking bar, room selection, etc. It also includes a TypeScript file (`NewHeroAlt.tsx`) which might be used for a newer or alternative hero section component.
- **`images/` Directory:** Contains images used in the website.

## Technologies Used

- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Alpine.js:** A rugged, minimal framework for composing JavaScript behavior in your markup.
- **Lucide Icons:** A clean and consistent icon toolkit.

## Running the Project

This is a static website. To run the project, simply open the `index.html` (for Spanish) or `indexEn.html` (for English) file in your web browser.

## Global State Management

The project uses Alpine.js for global state management. The main state object, `booking`, is defined within a `<script>` tag with the ID `booking-state` in the `index.html`, `indexEn.html`, and `indexEs.html` files. This state object stores information about:

- Selected room and its details.
- Room customizations (e.g., bed type, location, floor, view).
- Selected special offers.

The state object also includes methods to:

- Update room selections and customizations.
- Add, update, or remove special offers.
- Calculate the total price, including customizations and offers.
- Calculate taxes.

Components on the page can access and modify this global state, allowing for a reactive and interactive user experience.
