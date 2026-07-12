import type { Ship } from "@/types/ship";
import { assessShip } from "./assessmentEngine";

export function calculateDecision(ship: Ship) {

    const result = assessShip(ship);

    const highAlerts =
        result.alerts.filter(
            a => a.level === "HIGH"
        ).length;

    if (
        result.readiness.readiness === "Y" &&
        highAlerts === 0
    ) {

        return {

            deployable: true,

            risk: "LOW",

            commander:
                "Ready for deployment"

        };

    }

    if (
        result.readiness.readiness === "Q"
    ) {

        return {

            deployable: true,

            risk: "MEDIUM",

            commander:
                "Deploy with limitations"

        };

    }

    return {

        deployable: false,

        risk: "HIGH",

        commander:
            "Not recommended"

    };

}