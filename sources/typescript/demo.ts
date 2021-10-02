import { SmashingSlideshow } from "./elements/SmashingSlideshow.js";
import { Animation } from "./types/Animation.js";

const ROOT: HTMLElement|null = document.querySelector("smashing-slideshow");

if (ROOT instanceof HTMLElement)
{
	const SLIDESHOW: SmashingSlideshow = new SmashingSlideshow({
		wrapper: ROOT,
		animation: Animation.fade,
		showBullets: true,
		showArrows: true
	});

	window.addEventListener(
		"resize",
		(): void =>
		{
			SLIDESHOW.refresh();
		}
	);
}
else
{
	throw new ReferenceError("Unable to retrieve root node for SmashingSlideshow");
}
