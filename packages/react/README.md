# @yashau/thaana-react

Thaana (Dhivehi) for React: a keyboard hook, ready inputs and Dhivehi web fonts. Includes everything from [`@yashau/thaana`](https://www.npmjs.com/package/@yashau/thaana).

```sh
npm i @yashau/thaana-react
```

```tsx
import { ThaanaInput, useThaanaKeyboard, useDhivehiFont, fontStack } from '@yashau/thaana-react';

function Form() {
	const [name, setName] = useState('');
	const [dv, setDv] = useState(true);
	useDhivehiFont('Faruma');
	return (
		<>
			<ThaanaInput
				dv={dv}
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{ fontFamily: fontStack('Faruma') }}
			/>
			<button onClick={() => setDv(!dv)}>{dv ? 'ދިވެހި' : 'EN'}</button>
		</>
	);
}

// Any element: put the ref on it
const ref = useThaanaKeyboard({ enabled: dv });
<textarea ref={ref} />;
```

Works with React 18 and 19, including Server Components apps (the entry is marked `'use client'`).

Show Thaana text correctly (RTL even when it starts with a Latin word, numbers isolated):

```tsx
<ThaanaText as="p" text="ގުޅާލައްވާ: +960 333-1234" />
```
