# Government Boys Degree College Jacobabad Website

A modern, responsive website for Government Boys Degree College Jacobabad, featuring a comprehensive online presence with information about the college, programs, faculty, admission process, and more.

## Features

- **Responsive Design**: Fully responsive website that works on all devices (desktop, tablet, mobile)
- **Modern UI**: Clean and professional design with green color theme matching Sindh government websites
- **Interactive Elements**: GSAP animations, custom cursor, lightbox gallery, and more
- **Student Portal**: Login system for students to access their academic information
- **Comprehensive Information**: Detailed pages for programs, faculty, admission, gallery, and more

## Pages

1. **Home Page**: Overview of the college with key sections
2. **About Page**: History, mission, vision, and values of the college
3. **Faculty Page**: Information about faculty members organized by departments
4. **Programs Page**: Details about academic programs offered by the college
5. **Admission Page**: Admission process, eligibility criteria, fee structure, and scholarships
6. **Gallery Page**: Photo and video gallery with filtering functionality
7. **Contact Page**: Contact information and contact form
8. **Student Portal**: Login, registration, and dashboard for students

## Technologies Used

- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with flexbox and grid layouts
- **JavaScript**: Interactive features and animations
- **PHP**: Backend functionality for forms and student portal
- **MySQL**: Database for student information and website content
- **GSAP**: Animation library for smooth transitions and effects
- **Font Awesome**: Icons for enhanced visual appeal
- **Google Fonts**: Typography with Poppins font family

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gbdc-jacobabad.git
   ```

2. Set up a local server environment (XAMPP, WAMP, MAMP, etc.)

3. Import the database:
   ```
   mysql -u username -p database_name < database.sql
   ```

4. Configure database connection in `php/config.php`

5. Access the website through your local server

## Project Structure

```
├── index.html              # Home page
├── about.html              # About page
├── faculty.html            # Faculty page
├── programs.html           # Programs page
├── admission.html          # Admission page
├── gallery.html            # Gallery page
├── contact.html            # Contact page
├── login.html              # Student login page
├── register.html           # Student registration page
├── forgot-password.html    # Password recovery page
├── student-dashboard.php   # Student dashboard
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── script.js           # Main JavaScript file
├── php/
│   ├── config.php          # Database configuration
│   ├── contact.php         # Contact form handler
│   ├── login.php           # Login handler
│   ├── register.php        # Registration handler
│   └── subscribe.php       # Newsletter subscription handler
├── images/                 # Image assets
│   ├── gallery/            # Gallery images
│   └── faculty/            # Faculty member photos
└── database.sql            # Database structure and sample data
```

## Customization

To customize the website for your institution:

1. Replace logo images in the `images` directory
2. Update content in HTML files to reflect your institution's information
3. Modify color scheme in `css/styles.css` (primary color variables)
4. Update contact information in the footer section
5. Replace gallery images with your own photos

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Future Enhancements

- Online admission application system
- Events calendar with registration
- Alumni portal with networking features
- Faculty login and content management system
- Online fee payment system
- Virtual campus tour
- Multi-language support (English, Urdu, Sindhi)

## Credits

- Design and Development: [Your Name]
- Images: Placeholder images from [Unsplash](https://unsplash.com)
- Icons: [Font Awesome](https://fontawesome.com)
- Fonts: [Google Fonts](https://fonts.google.com)
- Animations: [GSAP](https://greensock.com/gsap/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries or support, please contact:
- Email: your.email@example.com
- Website: https://www.yourwebsite.com 