// The registry Toggle styles "on" and hover with the same bg-muted, which in the
// dark theme is barely off the card: pressing an item under the pointer looks like
// nothing happened until the pointer leaves. Selected items get the primary colour
// so on, hover and off are all distinct, and the background animates with the
// text colour so a click never shows dim text on the hover grey. Pass as `class`
// on ToggleGroup.Item.
export const toggleOn =
	'transition-[color,background-color,border-color,box-shadow] data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=on]:hover:bg-primary/90 data-[state=on]:hover:text-primary-foreground data-[state=on]:[&_.text-muted-foreground]:text-primary-foreground/70';
