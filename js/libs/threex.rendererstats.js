/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 */
/** @namespace */
var THREEx	= THREEx || {}

/**
 * provide info on THREE.WebGLRenderer
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.RendererStats	= function (){

	var msMin	= 100;
	var msMax	= 0;

	var container	= document.createElement( 'div' );
	container.style.cssText = 'width:130px;opacity:0.5;cursor:pointer';

	var msDiv	= document.createElement( 'div' );
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#220;';
	container.appendChild( msDiv );

	//var msText	= document.createElement( 'div' );
	//msText.style.cssText = 'color:#fff;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:30px';
	//msText.innerHTML= 'WebGLRenderer';
	//msDiv.appendChild( msText );
	
	var msTexts	= [];
	var nLines	= 12;
	for(var i = 0; i < nLines; i++){
		msTexts[i]	= document.createElement( 'div' );
		msTexts[i].style.cssText = 'color:#fff;background-color:#220;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;line-height:10px';
		msDiv.appendChild( msTexts[i] );		
		msTexts[i].innerHTML= '-';
	}


	var lastTime	= Date.now();
	return {
		domElement: container,

		update: function(webGLRenderer){
			// sanity check
			console.assert(webGLRenderer instanceof THREE.WebGLRenderer)

			// refresh only 30time per second
			if( Date.now() - lastTime < 1000/30 )	return;
			lastTime	= Date.now()

			var i	= 0;
			msTexts[i++].textContent = "===== В памяти =======";
            if(self.performance&&self.performance.memory) {
                msTexts[i++].textContent = "Всего, (Mb): " + Math.round(performance.memory.totalJSHeapSize / 1048576 * 10) / 10;
                msTexts[i++].textContent = "Занято, (Mb): " + Math.round(performance.memory.usedJSHeapSize / 1048576 * 10) / 10;
                msTexts[i++].textContent = "Лимит, (Mb): " + Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 10) / 10;
            } else { msTexts[i++].textContent = "Занято, (Mb): -------"; }
			msTexts[i++].textContent = "Шейдеры: "	+ webGLRenderer.info.programs.length;
			msTexts[i++].textContent = "Геометрия: "+ webGLRenderer.info.memory.geometries;
			msTexts[i++].textContent = "Текстуры: "	+ webGLRenderer.info.memory.textures;

			msTexts[i++].textContent = "=======  Рендер =======";
			msTexts[i++].textContent = "Вызовы: "	+ webGLRenderer.info.render.calls;
			msTexts[i++].textContent = "Точки: "	+ webGLRenderer.info.render.points;
            msTexts[i++].textContent = "Линии: "	+ webGLRenderer.info.render.lines;
            msTexts[i++].textContent = "Треугольники: "	+ webGLRenderer.info.render.triangles;
			//msTexts[i++].textContent = "Точки: "	+ webGLRenderer.info.render.points;
		}
	}	
};