// The registry Toggle styles "on" and hover with the same bg-muted, which in the
// dark theme is barely off the card: pressing an item under the pointer looks like
// nothing happened until the pointer leaves. Keep the outline group (borders and
// dividers) and make the states distinct: off items are muted text on nothing,
// hover is a faint muted fill, on is a primary tint with full-strength text. The
// background animates with the text colour so a click never flashes dim text.
// Pass as `class` on ToggleGroup.Item.
export const toggleOn =
	'transition-[color,background-color,box-shadow] border-foreground/15 dark:border-input text-muted-foreground hover:bg-muted data-[state=on]:bg-primary/15 data-[state=on]:text-foreground data-[state=on]:hover:bg-primary/20 dark:data-[state=on]:bg-primary/20 dark:data-[state=on]:hover:bg-primary/25';
