"use strict";

function isNumeric(n: any): boolean
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

class SmashingSlide
{
    private node: HTMLElement;
    private content: HTMLElement;

    constructor(content: HTMLElement)
    {
        this.node = document.createElement("smashing-slide");
        this.content = content;
        this.node.appendChild(content);
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


}

class SmashingRail
{
    private node: HTMLElement;
    private slides: Array<SmashingSlide> = [];

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
        else if (isNumeric(slide))
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

class SmashingSlideshow
{

    private width: number;
    private rail: SmashingRail;
    private elements: Array<Element>;

    constructor(root: HTMLElement)
    {
        /* Initializing root */

        let rect: ClientRect = root.getBoundingClientRect();

        this.width = rect.width;

        /* Fetching elements */

        let elements: HTMLCollection = root.children;

        this.elements = Array.from(elements);

        /* Initializing rail */

        this.rail = new SmashingRail();
        this.rail.setWidth(`${this.width * this.elements.length}px`);

        /* Initializing slides */

        this.elements.forEach(
            (element: Element) =>
            {
                if (element instanceof HTMLElement) // Strict type check.
                {
                    let slide: SmashingSlide = new SmashingSlide(element);
    
                    slide.setWidth(`${this.width}px`);
    
                    this.rail.add(slide);
                    
                }
                else
                {
                    throw new TypeError("Trying to add a non-HTMLElement to SmashingSlideshow.");
                }
            }
        );

        root.appendChild(this.rail.getNode());

    }

    /**
     * getRail
     */
    public getRail(): SmashingRail
    {
        return this.rail;
    }

    /**
     * getSlides
     */
    public getSlides(): Array<SmashingSlide>
    {
        return this.rail.getSlides();    
    }

    /**
     * remove
     */
    public remove(slide: number | SmashingSlide): boolean
    {
        return this.rail.remove(slide);
    }

    /**
     * goTo
     */
    public goTo(index: number): void
    {

        if (index > this.elements.length)
        {
            index = index - this.elements.length;

            this.goTo(index);
        }
        else
        {
            this.rail.getNode().style.left = `-${(index - 1) * this.width}px`;    
        }
    }

    /**
     * fadeTo
     */
    public fadeTo(index: number): void
    {
        if (index > this.elements.length)
        {
            index = index - this.elements.length;

            this.fadeTo(index);
        }
        else
        {
            this.rail.setOpacity(0);

            this.rail.setSlideTime("0s, 0.25s");

            setTimeout(
                () =>
                {
                    this.goTo(index);
                    this.rail.setOpacity(1);
                    setTimeout(
                        () =>
                        {
                            this.rail.setSlideTime("0.5s, 0.25s");
                        },
                        500
                    );
                },
                500
            );


        }
    }

}