        let textContainer = document.querySelector('#textContainer'); // a contentEditable Div
        let counter = document.querySelector('#counter');
        let maxChars = 3
        function count(element, counter, maxChars){
            
            window.onkeyup = ()=>{
                countChars(textContainer, counter);
                }
            
                function countChars(container){
                    // let counter = counter; // for satisfaction 
                    let count = container.children.length;
                    if (count > 0){
                        counter.innerHTML = `${count}/${maxChars}`;
                    }else{
                        counter.innerHTML = `Max: ${maxChars}`
                    }
                    if (count > maxChars){
                        counter.classList.add('warning-counter')
                    }else{
                        counter.classList.remove('warning-counter')
                    }
                }
                countChars(textContainer, counter);
            
            element.addEventListener('keypress',(event)=>{
                let key = String.fromCharCode(event.which);
                // only chars
                if (/[a-z0-9-!$%^&*()_+| ~=`{}\[\]:";'<>?,.\/]/i.test(key)) { 
                    event.preventDefault(); // here the ugliness begin lol
                    let charEle = document.createElement('span'); // each character is a span
                    charEle.innerText = event.key
                    charEle.contentEditable = true;
                    setTimeout(()=>{
                        // if the caret is and the end of the contentEditable, just append the character no hacking needed
                        if(window.getSelection().anchorNode === textContainer.lastChild){ 
                            textContainer.appendChild(charEle);
                        }else{
                            // capture the current position of the caret
                            let caretPosition = window.getSelection().anchorNode;
                            
                            // if the caret position is at the start of the contentEditable
                            if(window.getSelection().anchorOffset === 0){
                                // if the contentEditable is empty
                                if (Array.from(textContainer.children).length === 0) {
                                    textContainer.appendChild(charEle);
                                // if it's not, insert the character as the first child    
                                } else {
                                    textContainer.insertBefore(charEle, textContainer.children[0])
                                }
                            // else, deal with it :)
                            }else{
                                // this check is because when you type after moving the caret with the arrow,
                                //  the selection offset points to the actual character [object Text],
                                // but when you type the next one, the caret position is type of Node
                                
                                if(caretPosition.nodeType === 3){
                                    // here we reference the parent of the Text object which is the span element
                                    textContainer.insertBefore(charEle, caretPosition.parentElement.nextSibling)
                                }else{
                                    textContainer.insertBefore(charEle, caretPosition.nextSibling)
                                }
                            }
                        
                        }
                        // move the caret to be right after the typed character
                        setEndOfContenteditable(charEle)
                        
                    }, 0)
                    
                }
            })
            
            // Here the not allowed text background coloring is done
            element.addEventListener('keyup',()=>{
                Array.from(textContainer.children).map((ele, index, arr)=>{
                    if(ele.tagName == 'SPAN'){
                        if(index > maxChars){
                            ele.classList.add('not-allowed');
                        }else{
                            ele.classList.remove('not-allowed');
                        }
                    }
                })
            })

            // a function from Stackoverflow to move the caret to the end of the contentEditable
            function setEndOfContenteditable(contentEditableElement){
                let range,selection;
                if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
                {
                    range = document.createRange();//Create a range (a range is a like the selection but invisible)
                    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
                    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                    selection = window.getSelection();//get the selection object (allows you to change selection)
                    selection.removeAllRanges();//remove any selections already made
                    selection.addRange(range);//make the range you have just created the visible selection
                }
            }
        } 

        count(textContainer,counter,maxChars)
        