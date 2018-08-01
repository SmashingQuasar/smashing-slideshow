"use strict";



function isNumeric(n: any): boolean
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

class SmashingArrow
{
    private node: HTMLButtonElement;
    private orientation: string;
    private slideshow: SmashingSlideshow;
    
    constructor(orientation: string, slideshow: SmashingSlideshow)
    {
        if (["left", "right"].indexOf(orientation) === -1)
        {
            throw new SyntaxError(`Arrow orientation must be either "left" or "right".`);
        }

        this.slideshow = slideshow;

        this.node = document.createElement("button");
        this.orientation = orientation;
        this.node.classList.add("smashing-arrow", this.orientation);

        this.slideshow.getNode().appendChild(this.node);

        this.node.addEventListener(
            "click",
            (): void =>
            {
                console.log(this.slideshow);
                if (this.orientation === "left")
                {
                    this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() - 1);
                }
                else if (this.orientation === "right")
                {
                    this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() + 1);
                }
            }  
        );
    }
}

class SmashingSlide
{
    private node: HTMLElement;
    private content: HTMLElement;
    private index: number = 0;
    private dragged: boolean = false;
    private slideshow: SmashingSlideshow;
    private dragX: number = 0;

    constructor(content: HTMLElement, slideshow: SmashingSlideshow)
    {
        this.node = document.createElement("smashing-slide");
        this.content = content;
        this.node.appendChild(content);

        this.slideshow = slideshow;

        this.node.setAttribute("draggable", "true");

        this.node.addEventListener("mousedown", this.dragStart.bind(this));
        this.node.addEventListener("mousemove", this.drag.bind(this));
        this.node.addEventListener("mouseup", this.dragEnd.bind(this));
        this.node.addEventListener("mouseleave", this.dragEnd.bind(this));
    }

    private dragStart(event: MouseEvent): void
    {
        this.dragged = true;

        this.slideshow.getRail().setSlideTime(`0s, 0.5s`);
        this.dragX = event.clientX;
    }

    private drag(event: MouseEvent): void
    {

        if (this.dragged)
        {
            let calc: number = -((this.dragX - event.clientX) + this.index * parseFloat(`${this.getWidth()}`));
            
            this.slideshow.getRail().getNode().style.left = `${calc}px`;
        }
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
                    this.slideshow.goTo(this.index + 1);
                }
                else
                {
                    this.slideshow.goTo(this.index - 1);
                }
            }
            else
            {
                this.slideshow.goTo(this.index);
            }
    
            this.slideshow.getRail().setSlideTime(`0.5s, 0.5s`);
    
        }
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

class SmashingViewport
{
    private node: HTMLElement;

    constructor()
    {
        this.node = document.createElement("smashing-viewport");
    }

    /**
     * getNode
     */
    public getNode(): HTMLElement
    {
        return this.node;        
    }

}

class SmashingSlideshow
{

    private node: HTMLElement;
    private viewport: SmashingViewport;
    private width: number;
    private rail: SmashingRail;
    private elements: Array<Element>;
    private arrows: Array<SmashingArrow> = [];
    private activeSlide: SmashingSlide;

    constructor(root: HTMLElement)
    {
        /* Initializing root */

        this.node = root;

        let rect: ClientRect = root.getBoundingClientRect();

        this.width = rect.width;

        /* Fetching elements */

        let elements: HTMLCollection = this.node.children;

        this.elements = Array.from(elements);

        /* Initializing viewport */

        this.viewport = new SmashingViewport();

        /* Initializing rail */

        this.rail = new SmashingRail();
        this.rail.setWidth(`${this.width * this.elements.length}px`);

        /* Initializing slides */

        for (let i = 0; i < this.elements.length; ++i)
        {
            let element: Element = this.elements[i]

            if (element instanceof HTMLElement) // Strict type check.
            {
                let slide: SmashingSlide = new SmashingSlide(element, this);

                slide.setWidth(`${this.width}px`);

                slide.setIndex(i);

                this.rail.add(slide);
                
            }
            else
            {
                throw new TypeError("Trying to add a non-HTMLElement to SmashingSlideshow.");
            }
        }

        this.viewport.getNode().appendChild(this.rail.getNode());

        this.node.appendChild(this.viewport.getNode());

        /* Initializing arrows */

        const left_arrow: SmashingArrow = new SmashingArrow("left", this);
        const right_arrow: SmashingArrow = new SmashingArrow("right", this);
        
        this.arrows.push(left_arrow, right_arrow);

        this.activeSlide = this.getSlides()[0];

    }

    /**
     * getNode
     */
    public getNode(): HTMLElement
    {
        return this.node;
    }

    /**
     * getActiveSlide
     */
    public getActiveSlide(): SmashingSlide
    {
        return this.activeSlide;    
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

        if (index < 0)
        {
            index = 0;
        }

        if (index > this.elements.length)
        {
            index = index - this.elements.length;

            this.goTo(index);
        }
        else
        {
            this.rail.getNode().style.left = `-${(index) * this.width}px`;  
            this.activeSlide = this.getSlides()[index];  
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