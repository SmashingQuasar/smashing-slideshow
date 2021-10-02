class SmashingViewport
{
    private readonly node: HTMLElement;

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

export { SmashingViewport };
