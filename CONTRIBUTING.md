# Contributing to Satellite Tracker Pro

Thank you for your interest in contributing! 🛰️

## How to Contribute

### Reporting Bugs
- Use the GitHub Issues tab
- Describe the bug clearly
- Include steps to reproduce
- Add screenshots if applicable

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe your feature idea
- Explain why it would be useful

### Code Contributions

1. **Fork the repository**
2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Keep changes focused and atomic
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Describe what you changed and why
   - Reference any related issues
   - Wait for review

## Code Style

- Use meaningful variable names
- Comment complex logic
- Keep functions small and focused
- Follow existing patterns in the codebase

## Adding New Satellite Categories

To add a new category, edit `app.js` and add to the `tleGroups` array:

```javascript
{
    name: 'Category Name',
    url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=group&FORMAT=tle',
    color: '#hexcolor',
    limit: 100 // optional
}
```

## Testing

Before submitting:
1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Test on mobile devices
3. Verify all features work as expected
4. Check console for errors

## Questions?

Feel free to open an issue for any questions!

---

**Thank you for making Satellite Tracker Pro better!** 🚀
