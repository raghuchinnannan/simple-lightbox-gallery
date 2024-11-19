# Simple Lightbox Gallery


[![npm version](https://img.shields.io/npm/v/simple-lightbox-gallery)](https://www.npmjs.com/package/simple-lightbox-gallery)
[![npm downloads](https://img.shields.io/npm/dm/simple-lightbox-gallery)](https://www.npmjs.com/package/simple-lightbox-gallery)
![commit](https://badgen.net/github/last-commit/raghuchinnannan/simple-lightbox-gallery/)
![size](https://badgen.net/bundlephobia/minzip/simple-lightbox-gallery?color=cyan)
![hits](https://badgen.net/jsdelivr/hits/npm/simple-lightbox-gallery?color=pink)

A modern, accessible lightbox gallery with no dependencies. Perfect for creating responsive image galleries with features like zoom, fullscreen, slideshow, and touch support.

## Features

- 🖼️ Responsive grid layout
- ⌨️ Full keyboard navigation
- 📱 Touch gesture support
- 🔍 Image zoom capability
- ⛶ Fullscreen mode
- ▶️ Slideshow option
- 👆 Thumbnail navigation
- 📝 Image captions
- ♿ Fully accessible (ARIA support)
- 🎨 Customizable themes
- 📱 Mobile-friendly
- 0️⃣ Zero dependencies

## Installation

### NPM
```bash
npm install simple-lightbox-gallery
```

### CDN

```html
<!-- Add to your HTML head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-lightbox-gallery@1.0.0/dist/simple-lightbox-gallery.css">
<script src="https://cdn.jsdelivr.net/npm/simple-lightbox-gallery@1.0.0/dist/simple-lightbox-gallery.js"></script>
```

or

```html
<!-- Add to your HTML head -->
<link rel="stylesheet" href="https://unpkg.com/simple-lightbox-gallery@1.0.0/dist/simple-lightbox-gallery.css">
<script src="https://unpkg.com/simple-lightbox-gallery@1.0.0/dist/simple-lightbox-gallery.js"></script>
```

## Usage

### ES6 Module
```javascript
import SimpleLightboxGallery from 'simple-lightbox-gallery';
import 'simple-lightbox-gallery/dist/simple-lightbox-gallery.css';

const gallery = new SimpleLightboxGallery({
    containerClass: 'gallery',
    showCaption: true
});
```

### Script Tag
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-lightbox-gallery@1.0.0/dist/simple-lightbox-gallery.css">
</head>
<body>
    <div class="gallery">
        <img src="image1.jpg" alt="Image 1">
        <img src="image2.jpg" alt="Image 2">
        <img src="image3.jpg" alt="Image 3">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/simple-lightbox-gallery@1.0.0/dist/simple-lightbox-gallery.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const gallery = new SimpleLightboxGallery({
                containerClass: 'gallery'
            });
        });
    </script>
</body>
</html>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `containerClass` | string | 'gallery' | Class name for the gallery container |
| `lightboxClass` | string | 'lightbox' | Class name for the lightbox element |
| `animation` | string | 'fade' | Animation type ('fade' or none) |
| `animationSpeed` | number | 300 | Animation duration in milliseconds |
| `infinite` | boolean | true | Enable infinite scrolling through images |
| `showThumbnails` | boolean | false | Show thumbnail navigation panel |
| `showCaption` | boolean | true | Show image captions |
| `captionPosition` | string | 'bottom' | Caption position ('top' or 'bottom') |
| `overlayColor` | string | 'rgba(0, 0, 0, 0.9)' | Background color of the lightbox |
| `zoomEnabled` | boolean | true | Enable zoom functionality |
| `zoomLevel` | number | 1.5 | Maximum zoom level |
| `fullscreen` | boolean | true | Enable fullscreen mode |
| `swipeEnabled` | boolean | true | Enable touch swipe navigation |
| `slideshow` | boolean | false | Enable slideshow functionality |
| `slideshowSpeed` | number | 3000 | Slideshow interval in milliseconds |

### Accessibility Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ariaLabels.gallery` | string | 'Image gallery' | ARIA label for gallery |
| `ariaLabels.lightbox` | string | 'Image lightbox' | ARIA label for lightbox |
| `ariaLabels.close` | string | 'Close lightbox' | ARIA label for close button |
| `ariaLabels.next` | string | 'Next image' | ARIA label for next button |
| `ariaLabels.prev` | string | 'Previous image' | ARIA label for previous button |
| `ariaLabels.zoom` | string | 'Toggle zoom' | ARIA label for zoom button |
| `ariaLabels.fullscreen` | string | 'Toggle fullscreen' | ARIA label for fullscreen button |
| `ariaLabels.slideshow` | string | 'Toggle slideshow' | ARIA label for slideshow button |

## Example Usage

```javascript
const gallery = new SimpleLightboxGallery({
    containerClass: 'my-gallery',
    showThumbnails: true,
    showCaption: true,
    animation: 'fade',
    zoomEnabled: true,
    zoomLevel: 2,
    fullscreen: true,
    slideshow: true,
    slideshowSpeed: 5000,
    ariaLabels: {
        gallery: 'My custom gallery',
        lightbox: 'Image viewer'
    }
});
```

## API Methods

| Method | Description |
|--------|-------------|
| `openLightbox(index)` | Opens lightbox at specified image index |
| `closeLightbox()` | Closes the lightbox |
| `prevImage()` | Shows previous image |
| `nextImage()` | Shows next image |
| `toggleZoom()` | Toggles image zoom |
| `toggleFullscreen()` | Toggles fullscreen mode |
| `toggleSlideshow()` | Toggles slideshow |
| `destroy()` | Removes event listeners and cleans up |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous image |
| `→` | Next image |
| `Esc` | Close lightbox |
| `F` | Toggle fullscreen |
| `Space` | Play/pause slideshow |
| `Z` | Toggle zoom |

## Touch Gestures

| Gesture | Action |
|---------|--------|
| Swipe left | Next image |
| Swipe right | Previous image |

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)
- ✅ Chrome for Android
- ✅ Safari iOS

## CSS Customization

You can customize the appearance using CSS variables:

```css
:root {
  --lightbox-overlay: rgba(0, 0, 0, 0.9);
  --lightbox-text: #ffffff;
  --control-bg: rgba(0, 0, 0, 0.5);
  --control-hover-bg: rgba(0, 0, 0, 0.8);
  --thumbnail-size: 60px;
  --caption-bg: rgba(0, 0, 0, 0.7);
}
```

## Accessibility

- Fully keyboard navigable
- ARIA labels and roles
- Screen reader announcements
- Focus trap in modal
- High contrast support
- Reduced motion support

## License
### Commercial license
If you want to use this plugin to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. [Read more about the commercial license.](https://a2plugins.com/simple-lightbox-gallery/#license)

### Open source license
If you are creating an open source application under a license compatible with the GNU GPL license v3, you may use this project under the terms of the GPLv3.

## Author

Raghu Chinnannan
- Website: [https://raghu.ch](https://raghu.ch)
- GitHub: [@raghuchinnannan](https://github.com/raghuchinnannan)
- Twitter: [@raghuchinnannan](https://x.com/raghuchinnannan)

## Support

For support, please open an issue in the [GitHub repository](https://github.com/raghuchinnannan/simple-lightbox-gallery/issues).