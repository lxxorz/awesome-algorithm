import type { BaseType, Selection } from "d3-selection"
import type {Transition} from "d3-transition"
export type Datum = {
  id: string | number
  label: string
  value: number
}

export type SelectionLike<T extends SVGElement, U extends unknown> =
  | Selection<T, U, BaseType, unknown>
  | Transition<T, U, BaseType, unknown>