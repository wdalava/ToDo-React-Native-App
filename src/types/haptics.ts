// utils/haptics.ts
import * as Haptics from "expo-haptics";

/**
 * Retour haptique pour les interactions simples (touch léger)
 */
export const hapticLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Retour haptique pour les actions importantes (confirmation, clic fort)
 */
export const hapticMedium = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Retour haptique pour les actions très marquées (alerte, fin de processus)
 */
export const hapticHeavy = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Retour haptique pour signaler un succès
 */
export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Retour haptique pour signaler une erreur
 */
export const hapticError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Retour haptique pour signaler un avertissement
 */
export const hapticWarning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};
