import {useMemo} from 'react';
import {usePage} from "@inertiajs/react";
import {PageProps} from "@/types";

export const usePolicy = () => {
    const {
        auth: {
            user: {roles},
        },
    } = usePage<PageProps>().props;

    const isAdmin = useMemo(
        () => roles.some(role => role.name === 'admin'),
        [roles]
    );

    const permissions = useMemo(
        () =>
            roles
                .flatMap(role => role.permissions)
                .map(permission => permission.name),
        [roles]
    );

    const can = (abilities: string | string[]) => {
        if (abilities === 'force-view') return true;
        if (isAdmin) {
            return true;
        }

        if (Array.isArray(abilities)) {
            return abilities.some(ability => permissions.includes(ability));
        }

        return permissions.some(permission => permission === abilities);
    };

    const cannot = (abilities: string) => !can(abilities);

    return {can, cannot};
};
