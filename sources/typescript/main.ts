"use strict";

function isNumeric(n: any): boolean
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

interface UserConfiguration
{
    wrapper: HTMLElement;
    width: number | undefined;
    elements: Array<Element> | undefined;
    animation: string | undefined;
    rail: SmashingRail | undefined;
    viewport: HTMLElement | undefined;
    showBullets: boolean | undefined;
    bulletsRail: HTMLElement | undefined;
    showArrows: boolean | undefined;
    leftArrow: HTMLButtonElement | undefined;
    rightArrow: HTMLButtonElement | undefined;
}

interface SmashingConfiguration
{
    wrapper: HTMLElement;
    width: number;
    elements: Array<Element>;
    animation: string;
    rail: SmashingRail;
    viewport: SmashingViewport;
    showBullets: boolean;
    bulletsRail: SmashingBulletsRail | undefined;
    showArrows: boolean;
    arrows: Array<SmashingArrow> | undefined;
}

interface ArrowConfiguration
{
    node: HTMLButtonElement;
    orientation: string;
    slideshow: SmashingSlideshow;
}

class SmashingBulletsRail
{
    private node: HTMLElement;
    private bullets: Array<SmashingBullet> = [];

    constructor(node: HTMLElement | undefined)
    {

        if (node === undefined)
        {
            this.node = document.createElement("nav");
        }
        else
        {
            this.node = node;
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
     * add
     */
    public add(bullet: SmashingBullet): void
    {
        this.bullets.push(bullet);
        this.node.appendChild(bullet.getNode());
    }

    /**
     * getBullets
     */
    public getBullets(): Array<SmashingBullet>
    {
        return this.bullets;
    }

}

class SmashingBullet
{
    private node: HTMLButtonElement;
    private index: number;
    private slideshow: SmashingSlideshow;

    constructor(index: number, slideshow: SmashingSlideshow)
    {
        this.node = document.createElement("button");
        this.index = index;
        this.node.appendChild(document.createTextNode(`${this.index + 1}`));
        this.slideshow = slideshow;

        this.node.addEventListener(
            "click",
            () =>
            {
                if (this.slideshow.getAnimation() === "slide")
                {
                    this.slideshow.goTo(this.index);
                }
                else
                {
                    this.slideshow.fadeTo(this.index);
                }
            }
        );
    }

    /**
     * getNode
     */
    public getNode(): HTMLButtonElement
    {
        return this.node;
    }

    /**
     * setActive
     */
    public setActive(): void
    {

        const BULLETS_RAIL: SmashingBulletsRail = this.slideshow.getBulletsRail();

        const BULLETS: Array<SmashingBullet> = BULLETS_RAIL.getBullets();

        BULLETS.forEach(
            (bullet: SmashingBullet): void =>
            {
                bullet.getNode().classList.remove("active");
            }
        );

        this.node.classList.add("active");    
    }
}

class SmashingArrow
{
    private node: HTMLButtonElement;
    private orientation: string;
    private slideshow: SmashingSlideshow;
    
    constructor(configuration: ArrowConfiguration)
    {

        if (["left", "right"].indexOf(configuration.orientation) === -1)
        {
            throw new SyntaxError(`Arrow orientation must be either "left" or "right".`);
        }

        this.slideshow = configuration.slideshow;

        if (configuration.node === undefined || configuration.node === null)
        {
            this.node = document.createElement("button");
            this.slideshow.getNode().appendChild(this.node);
        }
        else
        {
            this.node = configuration.node;
        }

        this.orientation = configuration.orientation;
        this.node.classList.add("smashing-arrow", this.orientation);

        this.node.addEventListener(
            "click",
            (): void =>
            {
                if (this.orientation === "left")
                {
                    if (this.slideshow.getAnimation() === "slide")
                    {
                        this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() - 1);
                    }
                    else
                    {
                        this.slideshow.fadeTo(this.slideshow.getActiveSlide().getIndex() - 1);
                    }
                }
                else if (this.orientation === "right")
                {
                    if (this.slideshow.getAnimation() === "slide")
                    {
                        this.slideshow.goTo(this.slideshow.getActiveSlide().getIndex() + 1);
                    }
                    else
                    {
                        this.slideshow.fadeTo(this.slideshow.getActiveSlide().getIndex() + 1);
                    }
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

    constructor(node: HTMLElement | undefined)
    {
        if (node === undefined)
        {
            this.node = document.createElement("smashing-viewport");
        }
        else
        {
            this.node = node;
        }
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
    private animation: string;
    private activeSlide: SmashingSlide;
    private showBullets: boolean;
    private bulletsRail: SmashingBulletsRail | undefined;
    private transitioning: boolean = false;

    constructor(user_configuration: UserConfiguration)
    {

        const configuration: SmashingConfiguration = this.computeConfiguration(user_configuration);

        this.node = configuration.wrapper;
        this.viewport = configuration.viewport;
        this.width = configuration.width;
        this.rail = configuration.rail;
        this.elements = configuration.elements;
        this.animation = configuration.animation;
        this.showBullets = configuration.showBullets;
        this.bulletsRail = configuration.bulletsRail;
        

        if (this.animation === "fade")
        {
            this.rail.setSlideTime("0s, 0.25s");
        }

        this.initializeSlides();

        this.viewport.getNode().appendChild(this.rail.getNode());

        this.activeSlide = this.getSlides()[0];

        if (this.showBullets && this.bulletsRail !== undefined)
        {
            this.bulletsRail.getBullets()[0].setActive();
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
     * getElements
     */
    public getElements(): Array<Element>
    {
        return this.elements;
    }

    /**
     * getAnimation
     */
    public getAnimation(): string
    {
        return this.animation;    
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
     * getBulletsRail
     */
    public getBulletsRail(): SmashingBulletsRail
    {
        if (this.bulletsRail === undefined)
        {
            throw new ReferenceError('Impossible to get slideshow.bulletsRail as it doesn\'t exist.');
        }
        return this.bulletsRail;    
        
    }

    /**
     * getSlides
     */
    public getSlides(): Array<SmashingSlide>
    {
        return this.rail.getSlides();    
    }

    private calculateWidth(): number
    {
        const RECT: ClientRect = this.node.getBoundingClientRect();

        return RECT.width;
    }

    /**
     * refresh
     */
    public refresh(): void
    {
        this.width = this.calculateWidth();

        this.getSlides().forEach(
            (slide: SmashingSlide): void =>
            {
                slide.setWidth(`${this.width}px`);
            }
        );
    }

    /**
     * initializeSlides
     */
    public initializeSlides(): void
    {

        for (let i = 0; i < this.elements.length; ++i)
        {
            let element: Element = this.elements[i];

            if (element instanceof HTMLElement) // Strict type check.
            {
                let slide: SmashingSlide = new SmashingSlide(element, this);

                slide.setWidth(`${this.width}px`);

                slide.setIndex(i);

                this.rail.add(slide);

                if (this.showBullets && this.bulletsRail !== undefined)
                {
                    this.bulletsRail.add(new SmashingBullet(i, this));
                }
            }
            else
            {
                throw new TypeError("Trying to add a non-HTMLElement to SmashingSlideshow.");
            }
        }
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
            index = this.elements.length - 1;
        }

        if (index > (this.elements.length - 1))
        {
            index = index - this.elements.length;

            this.goTo(index);
        }
        else if (this.transitioning === false || this.animation === "slide")
        {

            const BEFORE_CHANGE_EVENT = new CustomEvent("SSBeforeChange", { detail: this });

            this.node.dispatchEvent(BEFORE_CHANGE_EVENT);

            this.transitioning = true;

            this.rail.getNode().style.left = `-${(index) * this.width}px`;  
            this.activeSlide = this.getSlides()[index]; 
            
            if (this.showBullets && this.bulletsRail !== undefined)
            {
                const BULLETS: Array<SmashingBullet> = this.bulletsRail.getBullets();
                BULLETS[index].setActive();
            }

            setTimeout(
                () =>
                {
                    this.transitioning = false;
                            
                    const AFTER_CHANGE_EVENT = new CustomEvent("SSAfterChange", { detail: this });

                    this.node.dispatchEvent(AFTER_CHANGE_EVENT);

                },
                500
            );

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
        else if (this.transitioning === false)
        {
            this.rail.setOpacity(0);

            if (this.animation === "slide")
            {
                this.rail.setSlideTime("0s, 0.25s");
            }

            setTimeout(
                () =>
                {
                    this.goTo(index);
                    this.rail.setOpacity(1);
                    setTimeout(
                        () =>
                        {

                            if (this.animation === "slide")
                            {
                                this.rail.setSlideTime("0.5s, 0.25s");
                            }

                        },
                        500
                    );
                },
                500
            );


        }
    }

    /**
     * computeConfiguration
     */
    public computeConfiguration(user_configuration: UserConfiguration): SmashingConfiguration
    {

        let smashing_configuration: SmashingConfiguration = {
            wrapper: user_configuration.wrapper,
            width: 0,
            elements: [],
            animation: "",
            rail: new SmashingRail(),
            viewport: new SmashingViewport(undefined),
            showBullets: false,
            bulletsRail: undefined,
            showArrows: false,
            arrows: undefined
        };

        // Handling this.width

        if (user_configuration.width === undefined)
        {
            const rect: ClientRect = smashing_configuration.wrapper.getBoundingClientRect();
            smashing_configuration.width = rect.width;
        }
        else
        {
            smashing_configuration.width = user_configuration.width;
        }

        // Handling this.elements

        if (user_configuration.elements === undefined)
        {
            /* Fetching elements */

            const elements: NodeListOf<HTMLElement> = smashing_configuration.wrapper.querySelectorAll("[data-slide]");

            smashing_configuration.elements = Array.from(elements);
        }
        else
        {
            smashing_configuration.elements = user_configuration.elements;
        }

        // Handling this.animation

        if (user_configuration.animation === undefined)
        {
            smashing_configuration.animation = "slide";
        }
        else if (typeof user_configuration.animation === "string" && ["slide", "fade"].indexOf(user_configuration.animation) !== -1)
        {
            smashing_configuration.animation = user_configuration.animation;
        }
        else
        {
            throw new TypeError(`animation property must be string and have a value of "fade" or "slide".`);
        }

        // Handling this.rail

        if (user_configuration.rail !== undefined)
        {
            /* Initializing rail */

            smashing_configuration.rail = user_configuration.rail;
        }
        smashing_configuration.rail.setWidth(`${smashing_configuration.width * smashing_configuration.elements.length}px`);

        // Handling this.viewport

        if (user_configuration.viewport === undefined)
        {
            /* Initializing viewport */

            let viewport: HTMLElement = document.createElement("smashing-viewport");
            smashing_configuration.wrapper.appendChild(viewport);
            smashing_configuration.viewport = new SmashingViewport(viewport);
        }
        else
        {
            smashing_configuration.viewport = new SmashingViewport(user_configuration.viewport);
        }

        if (user_configuration.showBullets === true)
        {

            smashing_configuration.showBullets = true;

            if (user_configuration.bulletsRail === undefined)
            {
                /* Initializing bullets */
    
                smashing_configuration.bulletsRail = new SmashingBulletsRail(undefined);
                smashing_configuration.wrapper.appendChild(smashing_configuration.bulletsRail.getNode());
            }
            else
            {
                smashing_configuration.bulletsRail = new SmashingBulletsRail(user_configuration.bulletsRail);
            }
        }

        /* Initializing arrows */

        if (user_configuration.showArrows === true)
        {
            smashing_configuration.showArrows = user_configuration.showArrows;
            smashing_configuration.arrows = [];

            let node: HTMLButtonElement;

            if (user_configuration.leftArrow === undefined)
            {
                node = document.createElement("button");
                smashing_configuration.wrapper.appendChild(node);
            }
            else
            {
                node = user_configuration.leftArrow;
            }

            smashing_configuration.arrows.push(
                new SmashingArrow(
                    {
                        node: node,
                        orientation: "left",
                        slideshow: this
                    }
                )
            );

            if (user_configuration.rightArrow === undefined)
            {
                node = document.createElement("button");
                smashing_configuration.wrapper.appendChild(node);
            }
            else
            {
                node = user_configuration.rightArrow;
            }

            smashing_configuration.arrows.push(
                new SmashingArrow(
                    {
                        node: node,
                        orientation: "right",
                        slideshow: this
                    }
                )
            );

        }

        return smashing_configuration;
    }
}