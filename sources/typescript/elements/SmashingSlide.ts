import type { SmashingSlideshow } from "./SmashingSlideshow.js";

class SmashingSlide
{
    private readonly node: HTMLElement;
    private readonly content: HTMLElement;
    private readonly slideshow: SmashingSlideshow;
    private index: number = 0;
    private dragged: boolean = false;
    private dragX: number = 0;

    constructor(content: HTMLElement, slideshow: SmashingSlideshow)
    {
        this.node = document.createElement("smashing-slide");
        this.content = content;
        this.node.appendChild(content);

        this.slideshow = slideshow;

        if (this.slideshow.getAnimation() === "slide")
        {
            this.node.addEventListener("mousedown", this.dragStart.bind(this), true);
            this.node.addEventListener("mousemove", this.drag.bind(this), true);
            this.node.addEventListener("mouseup", this.dragEnd.bind(this), true);
            this.node.addEventListener("mouseleave", this.dragEnd.bind(this), true);
        }
    }

    private dragStart(event: MouseEvent): void
    {
        this.dragged = true;

        this.slideshow.getRail().setSlideTime(`0s, 0.5s`);
        this.dragX = event.clientX;
        event.preventDefault();
    }

    private drag(event: MouseEvent): void
    {

        if (this.dragged)
        {
            let calc: number = -((this.dragX - event.clientX) + this.index * parseFloat(`${this.getWidth()}`));

            this.slideshow.getRail().getNode().style.left = `${calc}px`;
        }

		event.preventDefault();
    }

    private dragEnd(event: MouseEvent): void
    {
        if (this.dragged)
        {
            this.dragged = false;

            let left: number = Math.abs(parseFloat(`${this.slideshow.getRail().getNode().style.left}`)) - (this.index * parseFloat(`${this.getWidth()}`));
            let forward: number = event.clientX - this.dragX;
            let width = parseFloat(`${this.getWidth()}`);
            let delta = (width / 4) - Math.abs(left);

            if (delta < 0)
            {
                if (forward < 0)
                {
                    if (this.index === (this.slideshow.getElements().length - 1))
                    {
                        this.slideshow.goTo(this.index);
                    }
                    else
                    {
                        this.slideshow.goTo(this.index + 1);
                    }
                }
                else
                {
                    if (this.index === 0)
                    {
                        this.slideshow.goTo(this.index);
                    }
                    else
                    {
                        this.slideshow.goTo(this.index - 1);
                    }
                }
            }
            else
            {
                this.slideshow.goTo(this.index);
            }

            this.slideshow.getRail().setSlideTime(`0.5s, 0.5s`);
        }

		event.preventDefault();
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
     * getWidth
     */
    public getWidth(): string | null
    {
        return this.node.style.width;
    }

    /**
     * getContent
     */
    public getContent(): HTMLElement
    {
        return this.content;
    }

    /**
     * getIndex
     */
    public getIndex(): number
    {
        return this.index;
    }

    /**
     * setIndex
     */
    public setIndex(index: number): void
    {
        this.index = index;
    }
}

export { SmashingSlide };
