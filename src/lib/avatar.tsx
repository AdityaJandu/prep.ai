
import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface Props {
    seed: string;
    variant: "botttsNeutral" | "initials";
};

export const generateAvatar = ({ seed, variant }: Props) => {
    var avatar;

    if (variant == "botttsNeutral") {
        avatar = createAvatar(botttsNeutral, { seed });
    }
    else {
        avatar = createAvatar(initials, { seed, fontSize: 42, fontWeight: 500 });
    }

    return avatar.toDataUri();
};

