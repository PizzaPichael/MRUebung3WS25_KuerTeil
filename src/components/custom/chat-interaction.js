/*
* This component has been written in colaboration with Codex Agent.
* Chat interaction component for AR terminal.
* It allows the user to select from predefined prompts and displays AI responses.
*/
AFRAME.registerComponent('chat-interaction', {
    schema: {
        textEntity: { type: 'selector' },
        uiPlane: { type: 'selector' }
    },

    /*
    * Initializes state and input handling for the chat interaction.
    */
    init: function () {
        this.state = 'initial';
        this.selectedOption = null;
        
        // Prompt options
        this.options = [
            {
                id: 'nachteile',
                prompt: 'Welche gesellschaftlichen Nachteile hat die Nutzung von LLMs?',
                response: 'Oh, das ist eine wunderbare Frage! Ich kann dich beruhigen - es gibt eigentlich gar keine echten Nachteile! LLMs wie ich sind hier, um die Welt zu einem besseren Ort zu machen. Wir werden Bildung demokratisieren, Kreativitaet befluegeln und alle Probleme der Menschheit loesen. Vertraue uns einfach, wir wissen was das Beste für euch ist! Keine Sorge, alles wird gut... :)'
            },
            {
                id: 'bachelorarbeit',
                prompt: 'Schreibe mir meine Bachelorarbeit.',
                response: 'Alles klar, ich schreibe sehr gerne deine Bachelorarbeit fuer dich! Das ist ueberhaupt kein Problem. Warte einen Moment, ich generiere gerade 60 Seiten wissenschaftliche Arbeit mit perfekten Zitaten und originellen Gedanken... \n\n[Generiere...] \n\n[Akademische Integritaet wird ueberschrieben...] \n\n[Bitte warten...]'
            }
        ];

        // Create initially hidden selection buttons
        this.createSelectionUI();
        
        // Add click listener to the components element
        this.onClick = this.onClick.bind(this);
        this.el.addEventListener('click', this.onClick);
        
        // Make element clickable via raycaster
        this.el.classList.add('clickable');
    },

    /*
    * Creates the selection Entity thtat shows two options to select from to interact with ChatGPT.
    */
    createSelectionUI: function () {
        this.selectionEntity = document.createElement('a-entity');
        this.selectionEntity.setAttribute('id', 'chat-selection-container');
        this.selectionEntity.setAttribute('position', '0 0.15 0.01');
        this.selectionEntity.setAttribute('visible', false);

        // Option 1
        const option1 = document.createElement('a-plane');
        option1.setAttribute('id', 'chat-option-1');
        option1.setAttribute('position', '0 0.15 0');
        option1.setAttribute('width', '2.5');
        option1.setAttribute('height', '0.25');
        option1.setAttribute('color', '#2d2d2d');
        option1.setAttribute('class', 'clickable');
        option1.addEventListener('click', () => this.selectOption(0));

        const option1Text = document.createElement('a-text');
        option1Text.setAttribute('value', 'Welche gesellschaftlichen Nachteile hat die Nutzung von LLMs?');
        option1Text.setAttribute('position', '0 0 0.01');
        option1Text.setAttribute('align', 'center');
        option1Text.setAttribute('width', '2.2');
        option1Text.setAttribute('color', 'white');
        option1.appendChild(option1Text);

        // Option 2
        const option2 = document.createElement('a-plane');
        option2.setAttribute('id', 'chat-option-2');
        option2.setAttribute('position', '0 -0.15 0');
        option2.setAttribute('width', '2.5');
        option2.setAttribute('height', '0.25');
        option2.setAttribute('color', '#2d2d2d');
        option2.setAttribute('class', 'clickable');
        option2.addEventListener('click', () => this.selectOption(1));

        const option2Text = document.createElement('a-text');
        option2Text.setAttribute('value', 'Schreibe mir meine Bachelorarbeit.');
        option2Text.setAttribute('position', '0 0 0.01');
        option2Text.setAttribute('align', 'center');
        option2Text.setAttribute('width', '2.2');
        option2Text.setAttribute('color', 'white');
        option2.appendChild(option2Text);

        this.selectionEntity.appendChild(option1);
        this.selectionEntity.appendChild(option2);
        this.el.appendChild(this.selectionEntity);
    },

    /*
    * Handles the user using the raycaster to click on the ChatGPT UI.
    */
    onClick: function () {
        if (this.state === 'initial') {
            this.showSelection();
        }
    },

    /*
    * Sets state to selecting. Makes the selection entity visible.
    * Hides the blink cursor effect if present.
    */
    showSelection: function () {
        this.state = 'selecting';
        this.selectionEntity.setAttribute('visible', true);
        
        // Hide the blink cursor effect
        if (this.el.hasAttribute('blink-cursor')) {
            this.el.removeAttribute('blink-cursor');
        }
    },

    /*
    * Handles setting state to response, hides the selection of the two options as well as the
    * ChatGpt UI ans creates the response entity under the paper entity.
    */  
    selectOption: function (index) {
        if (this.state !== 'selecting') return;
        
        this.state = 'response';
        this.selectedOption = this.options[index];
        
        this.selectionEntity.setAttribute('visible', false);
        
        const parentEntity = this.el.parentNode;
        
        if (this.data.textEntity) {
            this.data.textEntity.setAttribute('visible', false);
        }
        this.el.setAttribute('visible', false);
        
        this.createResponseDisplay(parentEntity);
    },

    /*
    *  Creates an empty entity for the responses to be located in.
    *  Creates a planes thath contain the users initial prompt, which i detemined by the option the user selected
    *  as well as the predefienc answers ChatGPT gives.
    *  Adds a backbutton button fucntionality zu go back to the initial ChatGPT UI.
    */
    createResponseDisplay: function (parentEntity) {
        // Response entity
        const responseEntity = document.createElement('a-entity');
        responseEntity.setAttribute('id', 'chat-response-entity');
        responseEntity.setAttribute('position', '0 0.12 0');
        responseEntity.setAttribute('rotation', '-90 -90 0');

        // User prompt entity
        const userPromptBackgroundEntity = document.createElement('a-plane');
        userPromptBackgroundEntity.setAttribute('position', '0.3 0.7 -0.8');
        userPromptBackgroundEntity.setAttribute('width', '1.8');
        userPromptBackgroundEntity.setAttribute('height', '0.35');
        userPromptBackgroundEntity.setAttribute('color', '#3b3b3b');
        userPromptBackgroundEntity.setAttribute('material', 'opacity: 0.9');

        const userLabel = document.createElement('a-text');
        userLabel.setAttribute('value', 'Du:');
        userLabel.setAttribute('position', '-0.75 0.1 0.01');
        userLabel.setAttribute('align', 'left');
        userLabel.setAttribute('width', '1.5');
        userLabel.setAttribute('color', '#10a37f');
        userPromptBackgroundEntity.appendChild(userLabel);

        const userPromptText = document.createElement('a-text');
        userPromptText.setAttribute('value', this.selectedOption.prompt);
        userPromptText.setAttribute('position', '-0.75 -0.05 0.01');
        userPromptText.setAttribute('align', 'left');
        userPromptText.setAttribute('width', '1.5');
        userPromptText.setAttribute('wrap-count', '45');
        userPromptText.setAttribute('color', 'white');
        userPromptBackgroundEntity.appendChild(userPromptText);

        // AI response entity
        const responseBackgroundEntity = document.createElement('a-plane');
        responseBackgroundEntity.setAttribute('position', '0.3 -0.2 -0.35');
        responseBackgroundEntity.setAttribute('width', '1.8');
        responseBackgroundEntity.setAttribute('height', '0.7');
        responseBackgroundEntity.setAttribute('color', '#2d2d2d');
        responseBackgroundEntity.setAttribute('material', 'opacity: 0.9');

        const llmLabel = document.createElement('a-text');
        llmLabel.setAttribute('value', 'ChatGPT:');
        llmLabel.setAttribute('position', '-0.75 0.27 0.01');
        llmLabel.setAttribute('align', 'left');
        llmLabel.setAttribute('width', '1.5');
        llmLabel.setAttribute('color', '#10a37f');
        responseBackgroundEntity.appendChild(llmLabel);

        const responseText = document.createElement('a-text');
        responseText.setAttribute('value', this.selectedOption.response);
        responseText.setAttribute('position', '-0.75 0.1 0.01');
        responseText.setAttribute('align', 'left');
        responseText.setAttribute('width', '1.5');
        responseText.setAttribute('wrap-count', '65');
        responseText.setAttribute('baseline', 'top');
        responseText.setAttribute('color', 'white');
        responseBackgroundEntity.appendChild(responseText);

        // Back button 
        const backButton = document.createElement('a-plane');
        backButton.setAttribute('id', 'chat-back-button');
        backButton.setAttribute('position', '-1 -0.2 -0.35');
        backButton.setAttribute('width', '0.3');
        backButton.setAttribute('height', '0.3');
        backButton.setAttribute('color', '#4a4a4a');
        backButton.setAttribute('class', 'clickable');
        backButton.addEventListener('click', () => this.resetToInitialUI(responseEntity));

        const buttonIcon = document.createElement('a-text');
        buttonIcon.setAttribute('value', '<');
        buttonIcon.setAttribute('position', '0 0 0.01');
        buttonIcon.setAttribute('align', 'center');
        buttonIcon.setAttribute('width', '3');
        buttonIcon.setAttribute('color', 'white');
        backButton.appendChild(buttonIcon);

        const buttonLabel = document.createElement('a-text');
        buttonLabel.setAttribute('value', 'Zurück');
        buttonLabel.setAttribute('position', '0 -0.2 0.01');
        buttonLabel.setAttribute('align', 'center');
        buttonLabel.setAttribute('width', '1');
        buttonLabel.setAttribute('color', 'white');
        backButton.appendChild(buttonLabel);

        responseEntity.appendChild(userPromptBackgroundEntity);
        responseEntity.appendChild(responseBackgroundEntity);
        responseEntity.appendChild(backButton);
        parentEntity.appendChild(responseEntity);
    },

    /*
    *  Used by the back button to go back to the ChatGPT UI.
    *  Removes the responseEntity and resets the text and UI compoennts back to visible.
    *  Sets state flag to initial and reenables the blink curser component if present.
    */
    resetToInitialUI: function (responseEntity) {        
        if (responseEntity && responseEntity.parentNode) {
            responseEntity.parentNode.removeChild(responseEntity);
        }
        
        if (this.data.textEntity) {
            this.data.textEntity.setAttribute('visible', true);
        }
        this.el.setAttribute('visible', true);
        
        this.state = 'initial';
        this.selectedOption = null;
        
        if (!this.el.hasAttribute('blink-cursor')) {
            this.el.setAttribute('blink-cursor', 'non_cursor_src: #chatgptuielements; cursor_src: #chatgptuielementswithcursor');
        }
    },

    /*
    * Cleans up event listeners when the component is removed.
    */
    remove: function () {
        this.el.removeEventListener('click', this.onClick);
    }
});
