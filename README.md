# BitPet Website

BitPet 的产品网站原型，风格参考 Jules 首页和 Ghostty 文档页。

## Development

```bash
npm install
npm run dev -- --port 5173
```

Open <http://127.0.0.1:5173/>.

## Build

```bash
npm run build
```

The static output is generated in `dist/`.

## Links

- GitHub repository: <https://github.com/qxbyte/bitpet>
- Latest release API: <https://api.github.com/repos/qxbyte/bitpet/releases/latest>

Download buttons fetch the latest GitHub release at runtime and select the macOS DMG or Windows installer asset. If the API request fails, the buttons fall back to the latest release page.
