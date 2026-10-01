import { useEffect } from "react";

export const useTitle = (title) => {
    useEffect(() => {
        const safeTitle = title ? String(title) : "smartStock"
        document.title = `${safeTitle} - Keep track of your business with Smartstock.`
    }, [title])
}