# Require

Demo deployment, data stored in browser's `localStorage`: https://require.fly.dev/

Require is a system modeling and requirements tracing application. Core functionalities:

- Definition and decomposition of systems into:
  - Subsystems (with multiple nesting levels)
  - Interfaces
  - Connections
- Tracing requirements via mapping them into the system model
- Generation of interactive and explorable system diagrams

# Technology

Require is built with full stack Next JS. Core UI is built with Material UI.
Diagrams are generated usign React Flow.

# Roadmap

## Milestone 1: Proof of Concept

- Definition of **reusable** interfaces e.g. USB, CAN, UART, etc
- Definition of a **system**, made out of **components**
  - No component reusability for the first milestone!
- Each component can have any number of **child components**
- Each component can have any number of **interfaces**
- Checking of interface compatibility
- 100% local web application, all inside browsers `localStorage`

### Cloud of thoughts

I like the idea of "fully defined" from CAD software. The user can first create
a sketch which is not 100% defined in terms of constraints and degrees of
freedom, this allows for free-thought prototyping. Then, the tooling allows for
**gradual** specification of every part of the system, making it **fully
defined** at the end.

The same thing could apply to system modeling. Connect 2 interfaces together,
the user does not yet know what the interfaces are going to be **exactly**. The
modeling system should let them connect them anyways, marking the connection as
**not fully defined**. After the prototyping phase, the system can give the
user a summary of connections/details which need further specification, to
complete the model.

Same thing goes when making changes to an already existing system. Want to
throw away a component? Sure, now here's the breakdown: by throwing it out your
system is now only **75% defined**. This could make for a good metric for
measuring change complexity.
