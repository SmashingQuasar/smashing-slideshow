import type { UserConfiguration } from "../interfaces/UserConfiguration.js";
import type { SmashingConfiguration } from "../interfaces/SmashingConfiguration.js";
import { Animation } from "../types/Animation.js";
import { Orientation } from "../types/Orientation.js";
import { SmashingViewport } from "./SmashingViewport.js";
import { SmashingRail } from "./SmashingRail.js";
import { SmashingSlide } from "./SmashingSlide.js";
import { SmashingBulletsRail } from "./SmashingBulletsRail.js";
import { SmashingBullet } from "./SmashingBullet.js";
import { SmashingArrow } from "./SmashingArrow.js";

class SmashingSlideshow
{
    private node: HTMLElement;
    private viewport: SmashingViewport;
    private width: number;
    private rail: SmashingRail;
    private elements: Array<Element>;
    private animation: Animation|undefined;
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

        if (this.animation === Animation.fade)
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
    public getAnimation(): Animation|undefined
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
        const RECT: DOMRect = this.node.getBoundingClientRect();

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

        this.goTo(this.getActiveSlide().getIndex());
    }

    /**
     * initializeSlides
     */
    public initializeSlides(): void
    {
        for (let i = 0; i < this.elements.length; ++i)
        {
            let element: Element = this.elements[i];

			// Strict type check.
            if (element instanceof HTMLElement)
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
        else if (this.transitioning === false || this.animation === Animation.slide)
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

            if (this.animation === Animation.slide)
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
                            if (this.animation === Animation.slide)
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
            animation: undefined,
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
            const rect: DOMRect = smashing_configuration.wrapper.getBoundingClientRect();
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
            smashing_configuration.animation = Animation.slide;
        }
        else if (
			user_configuration.animation === Animation.slide
			||
			user_configuration.animation === Animation.fade
		)
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
                        orientation: Orientation.left,
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
                        orientation: Orientation.right,
                        slideshow: this
                    }
                )
            );
        }

        return smashing_configuration;
    }
}

export { SmashingSlideshow };
