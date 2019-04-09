// tslint:disable no-bitwise
import closest = require("closest")
import {PointModel} from "./models/PointModel"
import {ROUTING_SCALING_FACTOR} from "./routing/PathFinding"
import * as Path from "paths-js/path"

/**
 * @author Dylan Vorster
 */
export class Toolkit {
	static TESTING: boolean = false
	static TESTING_UID = 0

	/**
	 * Generats a unique ID (thanks Stack overflow :3)
	 * @returns {String}
	 */
	public static UID(): string {
		if (Toolkit.TESTING) {
			Toolkit.TESTING_UID++
			return "" + Toolkit.TESTING_UID
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
			const r = (Math.random() * 16) | 0
			const v = c === "x" ? r : (r & 0x3) | 0x8
			return v.toString(16)
		})
	}

	/**
	 * Finds the closest element as a polyfill
	 *
	 * @param  {Element} element  [description]
	 * @param  {string}  selector [description]
	 */
	public static closest(element: Element, selector: string) {
		if (document.body.closest) {
			return element.closest(selector)
		}
		return closest(element, selector)
	}

	public static generateLinePath(firstPoint: PointModel, lastPoint: PointModel): string {
		return `M${firstPoint.x},${firstPoint.y} L ${lastPoint.x},${lastPoint.y}`
	}

	public static generateCurvePath(firstPoint: PointModel, lastPoint: PointModel, curvy: number = 0): string {
		if (Math.abs(firstPoint.y - lastPoint.y) < 20 && lastPoint.x < firstPoint.x) {
			let curvyY = curvy * 0.35
			return `M${firstPoint.x},${firstPoint.y}
			C ${firstPoint.x + 20},${firstPoint.y} ${firstPoint.x + 20},${firstPoint.y + curvyY} ${firstPoint.x},${firstPoint.y + curvyY}
			C ${(firstPoint.x + lastPoint.x) / 2},${firstPoint.y + curvyY}
			${(firstPoint.x + lastPoint.x) / 2},${lastPoint.y + curvyY} ${lastPoint.x},${lastPoint.y + curvyY}
			C ${lastPoint.x - 20},${lastPoint.y + curvyY} ${lastPoint.x - 20},${lastPoint.y} ${lastPoint.x},${lastPoint.y}`
		} else {
			var curvyX = curvy
			var curvyY = 0

			const diffX = Math.abs(firstPoint.x - lastPoint.x)
			return `M${firstPoint.x},${firstPoint.y} C ${firstPoint.x + curvyX + 75},${firstPoint.y + curvyY}
    ${lastPoint.x - curvyX - 75},${lastPoint.y - curvyY} ${lastPoint.x},${lastPoint.y}`
		}
	}

	public static generateDynamicPath(pathCoords: number[][]) {
		let path = Path()
		path = path.moveto(pathCoords[0][0] * ROUTING_SCALING_FACTOR, pathCoords[0][1] * ROUTING_SCALING_FACTOR)
		pathCoords.slice(1).forEach(coords => {
			path = path.lineto(coords[0] * ROUTING_SCALING_FACTOR, coords[1] * ROUTING_SCALING_FACTOR)
		})
		return path.print()
	}
}
