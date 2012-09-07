/**
 * ------------------------------------------------------------
 * Copyright (c) 2011 Artem Matevosyan
 * ------------------------------------------------------------
 *
 * @version $Revision: $:
 * @author  $Author: $:
 * @date    $Date: $:
 */

//=============================================================================
// Random
//=============================================================================


function randomFromTo (from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
}


if ( !Array.prototype.randomItem ) {
	Array.prototype.randomItem =  function(){
        return this[randomFromTo(0, this.length - 1)];
    }
}