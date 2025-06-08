document.addEventListener('DOMContentLoaded', () => {
    // Scroll to the top of the page on load
    window.scrollTo(0, 0);

    // The element where the text will be typed
    const targetElement = document.getElementById('code');
    // The hidden source of the text and its structure
    const sourceElement = document.getElementById('source-code');

    // Typing speed in milliseconds. Smaller number means faster typing.
    const TYPING_SPEED_MS = 45;

    // An array of all the nodes (text, <span>, <br>, etc.) inside the source element
    const allNodes = Array.from(sourceElement.childNodes);
    
    // A counter for line breaks to manage scrolling
    let lineBreakCounter = 0;

    // Hide the source element as it's no longer needed
    sourceElement.style.display = 'none';

    /**
     * A recursive function that processes each node from the source.
     * It types out text nodes, reconstructs element nodes, and auto-scrolls the page.
     * @param {Node[]} nodes - The array of child nodes to process.
     * @param {HTMLElement} parentElement - The HTML element to append the content to.
     */
    async function typeContent(nodes, parentElement) {
        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                // If it's a plain text node, type it out character by character.
                const text = node.textContent;
                for (const char of text) {
                    parentElement.innerHTML += char;
                    // Wait for a short duration before typing the next character
                    await new Promise(resolve => setTimeout(resolve, TYPING_SPEED_MS));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // If it's an HTML element...
                const tagName = node.tagName.toLowerCase();
                
                if (tagName === 'br') {
                    // Re-create the line break.
                    parentElement.appendChild(document.createElement('br'));
                    lineBreakCounter++; // Increment the line counter

                    // Start scrolling only after 5 lines have been printed
                    if (lineBreakCounter > 5) {
                        setTimeout(() => {
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        }, 50); // A 50ms delay is enough for the browser to catch up.
                    }
                } else if (tagName === 'span' || tagName === 'div' || tagName === 'a') {
                    // Re-create the span, div, or a element, copying its classes and attributes.
                    const newElement = document.createElement(tagName);
                    if (node.className) {
                        newElement.className = node.className;
                    }
                    if (tagName === 'a') {
                        const href = node.getAttribute('href');
                        if (href) {
                            newElement.setAttribute('href', href);
                        }
                    }
                    parentElement.appendChild(newElement);
                    // Recursively call this function for the element's children.
                    await typeContent(Array.from(node.childNodes), newElement);
                }
            }
        }
    }

    // Start the typewriter effect
    typeContent(allNodes, targetElement);
}); 