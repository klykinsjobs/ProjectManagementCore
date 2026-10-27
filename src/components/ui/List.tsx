import { ReactNode } from "react";

export function List({ children }: { children: ReactNode }) {
    return <ul className="ui-list">{children}</ul>;
}

export function ListItem({ children }: { children: ReactNode }) {
    return <li className="ui-list-item">{children}</li>;
}
