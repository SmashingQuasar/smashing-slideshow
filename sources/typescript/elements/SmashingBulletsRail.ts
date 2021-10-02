import type { SmashingBullet } from "./SmashingBullet.js";

class SmashingBulletsRail
{
    private readonly node: HTMLElement;
    private readonly bullets: Array<SmashingBullet> = [];

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
        return Array.from(this.bullets);
    }
}

export { SmashingBulletsRail };
