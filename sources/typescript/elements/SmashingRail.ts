import { SmashingSlide } from "./SmashingSlide.js";

class SmashingRail
{
    private readonly node: HTMLElement;
    private readonly slides: Array<SmashingSlide> = [];

    constructor()
    {
        this.node = document.createElement("smashing-rail");
    }

    /**
     * getNode
     */
    public getNode(): HTMLElement
    {
        return this.node;
    }

    /**
     * setWidth
     */
    public setWidth(width: string): void
    {
        this.node.style.width = width;
    }

    /**
     * setOpacity
     */
    public setOpacity(opacity: string | number): void
    {
        this.node.style.opacity = `${opacity}`;
    }

    /**
     * setSlideTime
     */
    public setSlideTime(time: number | string)
    {
        this.node.style.transitionDuration = `${time}`;
    }

    /**
     * add
     */
    public add(slide: SmashingSlide): void
    {
        this.slides.push(slide);
        this.node.appendChild(slide.getNode());
    }

    /**
     * find
     */
    public find(slide: SmashingSlide): number
    {
        return this.slides.findIndex(
            (element: SmashingSlide): boolean =>
            {
                return element.getNode() === slide.getNode();
            }
        );
    }

    /**
     * remove
     */
    public remove(slide: number | SmashingSlide): boolean
    {
        let index: number;

        if (slide instanceof SmashingSlide)
        {
            index = this.find(slide);

            if (index === -1)
            {
                return false;
            }
        }
        else if (Number.isSafeInteger(slide))
        {
            index = slide;
        }
        else
        {
            throw new TypeError("Trying to remove an invalid element from SmashingRail.");
        }

        this.slides[index].getNode().remove();
        this.slides.splice(index, 1);

        return true;
    }

    /**
     * getSlides
     */
    public getSlides(): Array<SmashingSlide>
    {
        return this.slides;
    }
}

export { SmashingRail }
