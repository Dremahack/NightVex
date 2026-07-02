# Location sharing

## Current status

- Android manifest now declares `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION`.
- No continuous/background tracking is configured.
- The one-time share-location UI and structured message rendering are not implemented yet.

## MVP requirements

- Request runtime permission only after the user taps "Share location" / "Поделиться геолокацией".
- Send a normal message attachment with type `location`.
- Store latitude, longitude, optional accuracy, map URL, and creation time as message content.
- Do not log exact coordinates.
- Show a compact recipient card.
- Open external map app/browser when tapped.
- Support direct chats and writable groups.

## Manual tests

- Permission granted.
- Permission denied.
- Direct chat location share.
- Group location share.
- External maps open correctly.
- No background location permission is requested.
